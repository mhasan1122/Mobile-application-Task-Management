from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import User
from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "status": True,
            "message": "User registered successfully",
            "data": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)

        return Response({
            "status": True,
            "message": "Login successful",
            "data": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")

            if not refresh_token:
                return Response({
                    "status": False,
                    "message": "Refresh token is required"
                }, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({
                "status": True,
                "message": "Logout successful"
            }, status=status.HTTP_200_OK)

        except TokenError as e:
            return Response({
                "status": False,
                "message": f"Invalid token: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "status": False,
                "message": "Logout failed due to an unexpected error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetAllUsersView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().values('id', 'email', 'username')
        return Response({
            "status": True,
            "message": "Users fetched successfully",
            "data": list(users)
        }, status=status.HTTP_200_OK)


class GetUserByIdView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            return Response({
                "status": True,
                "message": "User fetched successfully",
                "data": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username
                }
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)


class UpdateUserByIdView(APIView):
    # permission_classes = [IsAuthenticated]

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)

            serializer = RegisterSerializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({
                "status": True,
                "message": "User updated successfully",
                "data": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username
                }
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                "status": False,
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)