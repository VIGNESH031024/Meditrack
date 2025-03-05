from django.urls import path
from .views import medicine_list, medicine_detail, inventory_list, inventory_detail,order_detail,order_list

urlpatterns = [
    #medicine CURD API
    path('medicines/', medicine_list, name='medicine_list'),
    path('medicines/<int:id>/', medicine_detail, name='medicine_detail'),


    path('inventory/', inventory_list, name='inventory-list'),
    path('inventory/<int:id>/', inventory_detail, name='inventory-detail'),

    path('orders/', order_list, name='order_list'),
    path('orders/<int:pk>/', order_detail, name='order_detail'),


]
