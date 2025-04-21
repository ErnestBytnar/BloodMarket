from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer,BloodOfferSerializer,BloodTransactionSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import BloodTypes,BloodTransaction,BloodOffers
from. forms import BloodOffersForm,TypesForm,TransactionForm




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

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
@permission_classes([AllowAny])

def get_data_from_blood_transactions(request):
    blood_offers = BloodTransaction.objects.all()
    serializer = BloodTransactionSerializer(blood_offers,many=True)
    return Response(serializer.data)


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
@permission_classes([AllowAny])

def get_data_from_blood_offers(request):
    blood_offers = BloodOffers.objects.all()
    serializer = BloodOfferSerializer(blood_offers,many=True)
    return Response(serializer.data)



@api_view(["POST"])
@permission_classes([AllowAny])
def make_transaction(request):
    try:
        offer_id = request.data.get('offer_id')
        buyer_id = request.data.get('buyer_id')

        if not offer_id or not buyer_id:
            return Response({'error': 'Brakuje offer_id albo buyer_id'}, status=400)

        try:
            offer = BloodOffers.objects.get(id=offer_id)
        except BloodOffers.DoesNotExist:
            return Response({'error': 'Nie ma takiej oferty'}, status=404)

        if not offer.available:
            return Response({'error': 'Ta oferta nie jest już dostępna'}, status=400)

        try:
            buyer = User.objects.get(id=buyer_id)
        except User.DoesNotExist:
            return Response({'error': 'Kupujacy nie znaleziony !'}, status=404)

        transaction = BloodTransaction.objects.create(
            offer_id=offer,
            buyer_id=buyer,
            total_price=offer.total_price
        )
        offer.available = False
        offer.save()

        serializer = BloodTransactionSerializer(transaction)
        return Response(serializer.data, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
