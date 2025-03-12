from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Product, Supplier, Order, OrderItem, Notification, StockAlert, SalesData

# Get the custom User model
User = get_user_model()


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar']


# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# Supplier Serializer
class SupplierSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, queryset=Product.objects.all())

    class Meta:
        model = Supplier
        fields = '__all__'


# Order Item Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'unit_price', 'total_price']


# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all())  # Accepts only IDs

    class Meta:
        model = Order
        fields = '__all__'
# Notification Serializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


# Stock Alert Serializer
class StockAlertSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = StockAlert
        fields = '__all__'


# Sales Data Serializer
class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesData
        fields = '__all__'
