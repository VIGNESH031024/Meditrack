from django.urls import path
from .views import (
    ProductListCreateAPIView, ProductDetailAPIView,
    SupplierListCreateAPIView, SupplierDetailAPIView,
    OrderListCreateAPIView, OrderDetailAPIView
)

urlpatterns = [
    # ✅ Product URLs
    path('api/products/', ProductListCreateAPIView.as_view(), name='product-list'),
    path('api/products/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),

    # ✅ Supplier URLs
    path('api/suppliers/', SupplierListCreateAPIView.as_view(), name='supplier-list'),
    path('api/suppliers/<int:pk>/', SupplierDetailAPIView.as_view(), name='supplier-detail'),

    # ✅ Order URLs
    path('api/orders/', OrderListCreateAPIView.as_view(), name='order-list'),
    path('api/orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
]
