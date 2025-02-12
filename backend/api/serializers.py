from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # Include product details

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "total_price"]

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Include cart items

    class Meta:
        model = Cart
        fields = ["id", "user", "items"]

# serializers.py
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = '__all__'
        read_only_fields = ('user',)

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderUpdateSerializer(serializers.ModelSerializer):
    shipping_address = serializers.PrimaryKeyRelatedField(
        queryset=UserAddress.objects.all(),
        required=False
    )
    
    class Meta:
        model = Order
        fields = ['status', 'payment_method', 'shipping_address']
        extra_kwargs = {
            'status': {'required': False},
            'payment_method': {'required': False}
        }
