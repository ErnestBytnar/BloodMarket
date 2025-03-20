from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializer import UserSerializer,UserRegisterSerializer
from rest_framework import status
from rest_framework.permissions import  IsAuthenticated, AllowAny
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if(request.method=='POST'):
        serializer = UserRegisterSerializer(data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response({"message":"Pomyślnie utworzono konto"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)