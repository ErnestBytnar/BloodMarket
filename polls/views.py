from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny


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
