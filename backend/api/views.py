from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated ,AllowAny
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import *
from .serializers import *

class ProductList(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        items = Product.objects.all()
        serializer = ProductSerializer(items, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def register(request):
    data = request.data
    try:
        user = User.objects.create(
            email=data['email'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            password=make_password(data['password']),
            address=data.get('address', ''),
            phone_number=data.get('phone_number', '')
        )
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@ensure_csrf_cookie
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=email, password=password)
    if user is not None:
        login(request, user)
        csrf_token = get_token(request)
        refresh = RefreshToken.for_user(user) 
        return Response({
            'message': 'User logged in successfully',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {'email': user.email, 'first_name': user.first_name},
            'csrf_token':csrf_token}, 
            status=status.HTTP_200_OK
            )
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def current_user(request):
    user = request.user
    if user.is_authenticated:
        return Response({'email': user.email, 'first_name': user.first_name})
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({"message": "CSRF cookie set"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({'email': user.email, 'first_name': user.first_name, 'last_name': user.last_name, 'address': user.address, 'phone_number': user.phone_number})
