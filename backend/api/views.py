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
            #address=data.get('address', ''),
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

@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            'email': user.email, 
            'first_name': user.first_name, 
            'last_name': user.last_name, 
            'phone_number': user.phone_number
            })
    elif request.method == 'PUT':
        data = request.data
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.save()
        return Response({
            'email': user.email, 
            'first_name': user.first_name, 
            'last_name': user.last_name, 
            'phone_number': user.phone_number
        })

class CartView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        try:
            product = Product.objects.get(id=product_id)
            cart, created = Cart.objects.get_or_create(user=request.user)
            
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not item_created:
                cart_item.quantity += quantity
                cart_item.save()
                
            return Response(CartSerializer(cart).data)
            
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=404)

# views.py
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def addresses(request):
    if request.method == 'GET':
        addresses = UserAddress.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['DELETE','PATCH'])
@permission_classes([IsAuthenticated])
def update_address(request, address_id):
    try:
        address = UserAddress.objects.get(id=address_id, user=request.user)
    except UserAddress.DoesNotExist:
        return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PATCH':
        serializer = AddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        address.delete()
        return Response({'message': 'Address deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        cart = Cart.objects.get(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)
        
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate total price using product's final price
        total_price = sum(
            item.quantity * item.product.get_final_price()
            for item in cart_items
        )
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=total_price,
            status='Pending'
        )
        
        # Clear cart
        cart_items.delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        serializer = OrderUpdateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            # Update validated fields
            for attr, value in serializer.validated_data.items():
                setattr(order, attr, value)
            
            # Special handling for shipping_address
            if 'shipping_address' in serializer.validated_data:
                address = serializer.validated_data['shipping_address']
                if address.user != request.user:
                    return Response({'error': 'Invalid address'}, status=400)
                order.shipping_address = address
            
            order.save()
            return Response(OrderSerializer(order).data)
            
        return Response(serializer.errors, status=400)
        
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)