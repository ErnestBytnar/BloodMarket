from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_offer(request):
    offer_id = request.data.get('offer_id')
    offer = get_object_or_404(BloodOffers, id=offer_id, available=True)

    transaction = BloodTransaction.objects.create(
        buyer_id=request.user,
        offer_id=offer,
        total_price=offer.total_price
    )

    offer.available = False
    offer.save()

    return Response({'message': 'Zakupiono', 'transaction_id': transaction.id})


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
