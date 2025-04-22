from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer,BloodOfferSerializer,BloodTransactionSerializer,MakeTransactionSerializer,CreateOfferSerializer,BloodTypesSerializer
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

@api_view(["GET"])
@permission_classes([AllowAny])
def show_blood_types(request):
    offers = BloodTypes.objects.all()
    serializer = BloodTypesSerializer(offers,many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_offer(request):
    serializer = CreateOfferSerializer(data=request.data)
    if serializer.is_valid():
        offer = serializer.save()
        return Response(CreateOfferSerializer(offer).data,status=201)
    else:
        return Response(serializer.errors, status=400)



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
    serializer = MakeTransactionSerializer(data=request.data)

    if serializer.is_valid():
        transaction = serializer.save()
        return Response(MakeTransactionSerializer(transaction).data,status=201)
    else:
        return Response(serializer.errors, status=400)



@api_view(['GET'])
#@permission_classes([IsAuthenticated])
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
