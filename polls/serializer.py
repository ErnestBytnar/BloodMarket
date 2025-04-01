from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields= ['id','username','email']


class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password=serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','password','email']

    def validate_username(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Nazwa użytkownika musi mieć co najmniej 2 znaki.")

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Nazwa użytkownika jest już zajęta.")

        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Hasło musi mieć co najmniej 8 znaków.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jedną cyfrę.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jedną małą literę.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jedną dużą literę.")
        if not any(char in '@$!%*?&' for char in value):
            raise serializers.ValidationError("Hasło musi zawierać co najmniej jeden znak specjalny @$!%*?&]")

        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Adres e-mail jest już zajęty.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        return user