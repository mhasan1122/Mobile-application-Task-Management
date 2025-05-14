from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(write_only=True)  # Changed from EmailField to CharField
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Try to authenticate with the provided credentials as either email or username
        user = authenticate(username=data['email'], password=data['password'])
        
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")