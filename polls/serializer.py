from dataclasses import fields

from rest_framework import serializers
from django.contrib.auth.models import User, Group
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import BloodOffers,BloodTypes,BloodTransaction

class BloodTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodTypes
        fields = '__all__'


class CreateOfferSerializer(serializers.ModelSerializer):

    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    blood_type_id = serializers.PrimaryKeyRelatedField(queryset=BloodTypes.objects.all())

    class Meta:
        model = BloodOffers
        fields = ['user_id', 'blood_type_id', 'volume_ml', 'total_price', 'location']

    def validate_volume_ml(self,value):
        if value <= 0:
            raise serializers.ValidationError("Za mało krwi !!")
        else:
            return value

    def validate_price(self,price):
        if price <=0:
            raise serializers.ValidationError("Za niska cena !!")
        else:
            return price

    def create(self,validated_data):
        user = validated_data['user_id']
        blood_type = validated_data['blood_type_id']
        volume = validated_data['volume_ml']
        price = validated_data['total_price']
        location = validated_data['location']

        offer = BloodOffers.objects.create(
            user_id=user,
            blood_type_id=blood_type,
            volume_ml=volume,
            total_price=price,
            location=location
        )
        return offer

class BloodOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodOffers
        fields ='__all__'

class BloodTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodTransaction
        fields =['offer_id','buyer_id','total_price']

class MakeTransactionSerializer(serializers.ModelSerializer):
    offer_id = serializers.PrimaryKeyRelatedField(queryset=BloodOffers.objects.all())
    buyer_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = BloodTransaction
        fields = ['offer_id', 'buyer_id']

    def validate(self, data):
        offer = data.get('offer_id')
        if not offer.available:
            raise serializers.ValidationError("Ta oferta nie jest już dostępna.")
        return data

    def create(self, validated_data):
        offer = validated_data['offer_id']
        buyer = validated_data['buyer_id']

        transaction = BloodTransaction.objects.create(
            offer_id=offer,
            buyer_id=buyer,
            total_price=offer.total_price
        )

        offer.available = False
        offer.save()

        return transaction







class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'groups']

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]




class UserRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

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
        user_group = Group.objects.get(name='User')
        user.groups.add(user_group)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_active:
            raise AuthenticationFailed("Konto jest nieaktywne.")

        groups = list(self.user.groups.values_list("name", flat=True))

        data["groups"] = groups
        self.user.groups_list = groups

        return data
