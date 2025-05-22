from datetime import timedelta,timezone

from django.contrib.auth.decorators import login_required
from django.db.models import Q, Subquery, OuterRef
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer,BloodOfferSerializer,BloodTransactionSerializer,MakeTransactionSerializer,CreateOfferSerializer,BloodTypesSerializer,UserProfileSerializer,MessageSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import BloodTypes,BloodTransaction,BloodOffers,Message,Chat
from. forms import BloodOffersForm,TypesForm,TransactionForm
from .search_filter import BloodOffersFilter
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.timezone import now
from .utils import log_account_event



def test_dummy_home(request):
    blood_types = BloodTypes.objects.all()
    blood_transaction = BloodTransaction.objects.all()
    blood_offers = BloodOffers.objects.all()
    blood_offers_form = BloodOffersForm()
    types_form = TypesForm()
    transaction_form = TransactionForm()


    context = {'blood_types' : blood_types,'blood_transactions':blood_transaction,'blood_offers':blood_offers
               ,'blood_offers_form':blood_offers_form,'types_form':types_form,'transaction_form':transaction_form}

    if request.method == "POST":
        blood_offers_form = BloodOffersForm(request.POST)
        if blood_offers_form.is_valid():
            blood_offers_form.save()
    if request.method == "POST":
        types_form = TypesForm(request.POST)
        if types_form.is_valid():
            types_form.save()
    if request.method == "POST":
        transaction_form = TransactionForm(request.POST)
        if transaction_form.is_valid():
            transaction_form.save()

    return render(request,'home.html',context)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_or_get_private_chat(request):
    other_user_id = request.data.get('other_user_id')
    if not other_user_id:
        return Response({"error": "other_user_id is required"}, status=400)

    try:
        other_user = User.objects.get(id=other_user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    user = request.user

    chats = Chat.objects.filter(participants=user).filter(participants=other_user)
    if chats.exists():
        chat = chats.first()
    else:
        chat = Chat.objects.create()
        chat.participants.add(user, other_user)
        chat.save()

    # Załóżmy, że masz w modelu Chat pole 'name' lub 'slug', które jest unikalne
    return Response({
        "chat_id": chat.id,
          # lub chat.slug jeśli masz
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chat_room(request, room_name):
    search_query = request.GET.get('search', '')
    current_user = request.user

    # Pobieranie wszystkich wiadomości pomiędzy użytkownikami
    chats = Message.objects.filter(
        (Q(sender=current_user) & Q(receiver__username=room_name)) |
        (Q(receiver=current_user) & Q(sender__username=room_name))
    )

    if search_query:
        chats = chats.filter(Q(content__icontains=search_query))

    chats = chats.order_by('timestamp')

    serializer = MessageSerializer(chats, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = request.user
    receiver_username = request.data.get('receiver')
    content = request.data.get('content')

    if not receiver_username or not content:
        return Response({"error": "receiver and content are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({"error": "Receiver not found"}, status=status.HTTP_404_NOT_FOUND)

    message = Message.objects.create(sender=sender, receiver=receiver, content=content)
    serializer = MessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chat_overview(request):
    current_user = request.user

    # Subquery na ostatnią wiadomość z użytkownikiem user
    last_message_subquery = Message.objects.filter(
        (Q(sender=current_user) & Q(receiver=OuterRef('pk'))) |
        (Q(receiver=current_user) & Q(sender=OuterRef('pk')))
    ).order_by('-timestamp')

    users = User.objects.exclude(id=current_user.id).annotate(
        last_message_id=Subquery(last_message_subquery.values('id')[:1]),
        last_message_timestamp=Subquery(last_message_subquery.values('timestamp')[:1])
    ).order_by('-last_message_timestamp')

    # Pobranie wszystkich ostatnich wiadomości naraz
    last_message_ids = [user.last_message_id for user in users if user.last_message_id]

    messages = Message.objects.filter(id__in=last_message_ids)
    messages_dict = {msg.id: msg for msg in messages}

    serialized_data = []
    for user in users:
        last_msg = messages_dict.get(user.last_message_id)
        serialized_data.append({
            "user": {
                "id": user.id,
                "username": user.username
            },
            "last_message": MessageSerializer(last_msg).data if last_msg else None
        })

    return Response(serialized_data)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    profile = request.user.userprofile

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


#po 7 dniach oferty avaible = False
def get_queryset(self):
    cutoff = timezone.now() - timedelta(days=7)
    BloodOffers.objects.filter(available=True, created_at__lt=cutoff).update(available=False)
    return BloodOffers.objects.all()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    user = request.user

    # Wystawione oferty
    user_offers = BloodOffers.objects.filter(user_id=user)
    user_offers_serializer = BloodOfferSerializer(user_offers, many=True)

    # Kupione oferty (transakcje)
    user_transactions = BloodTransaction.objects.filter(buyer_id=user)
    user_transactions_serializer = BloodTransactionSerializer(user_transactions, many=True)

    # Dane użytkownika
    user_data = UserSerializer(user).data

    return Response({
        "user_data": user_data,
        "my_offers": user_offers_serializer.data,
        "my_purchases": user_transactions_serializer.data
    })



@api_view(["GET"])
@permission_classes([IsAuthenticated])
#@permission_classes([IsAuthenticated])
def show_blood_types(request):
    offers = BloodTypes.objects.all()
    serializer = BloodTypesSerializer(offers,many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_single_blood_type(request,pk):
    offers = BloodTypes.objects.all()
    serializer = BloodTypesSerializer(offers)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sorted_offers(request):
    sort_by = request.GET.get('sort_by', 'id')       # np. 'total_price', 'volume_ml'
    order = request.GET.get('order', 'asc')          # 'asc' lub 'desc'

    allowed_fields = ['id', 'total_price', 'volume_ml', 'location', 'created_at']

    if sort_by not in allowed_fields:
        return Response({'error': f'Nie można sortować po {sort_by}'}, status=400)

    sort_expression = f"-{sort_by}" if order == 'desc' else sort_by

    offers = BloodOffers.objects.all().order_by(sort_expression)
    serializer = BloodOfferSerializer(offers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_single_offer(request, pk):
    offer = get_object_or_404(BloodOffers, pk=pk)
    serializer = BloodOfferSerializer(offer)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_single_transaction(request, pk):
    transaction = get_object_or_404(BloodTransaction, pk=pk)
    serializer = BloodTransactionSerializer(transaction)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_offer(request):
    serializer = CreateOfferSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        offer = serializer.save()
        return Response(CreateOfferSerializer(offer).data,status=201)
    else:
        return Response(serializer.errors, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data_from_blood_transactions(request):
    blood_offers = BloodTransaction.objects.all()
    serializer = BloodTransactionSerializer(blood_offers,many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])

def get_data_from_blood_offers(request):
    blood_offers = BloodOffersFilter(request.GET,queryset=BloodOffers.objects.all())

    if not blood_offers.is_valid():
        return Response(blood_offers.errors,status=400)

    serializer = BloodOfferSerializer(blood_offers.qs,many=True)
    return Response(serializer.data)





@api_view(["POST"])
@permission_classes([IsAuthenticated])
def make_transaction(request):
    serializer = MakeTransactionSerializer(data=request.data)

    if serializer.is_valid():
        transaction = serializer.save()
        return Response(MakeTransactionSerializer(transaction).data,status=201)
    else:
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegisterSerializer(data=request.data)
    if (serializer.is_valid()):
        serializer.save()
        return Response({"message": "Pomyślnie utworzono konto"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(ratelimit(key='ip', rate='3/m', method="POST", block=False), name='post')
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        if getattr(request, 'limited', False):
            return JsonResponse({"error": "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę."}, status=429)
        return super().post(request, *args, **kwargs)

