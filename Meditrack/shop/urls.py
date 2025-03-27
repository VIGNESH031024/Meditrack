from django.urls import path
from .views import *

urlpatterns = [
    # ✅ Product URLs
    path('api/products/', ProductListCreateAPIView.as_view(), name='product-list'),
    path('api/products/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path("api/product/sku/", get_product_by_sku, name="get_product_by_sku"),

    # ✅ Supplier URLs
    path('api/suppliers/', SupplierListCreateAPIView.as_view(), name='supplier-list'),
    path('api/suppliers/<int:pk>/', SupplierDetailAPIView.as_view(), name='supplier-detail'),

    # ✅ Order URLs
    path('api/orders/', OrderListCreateAPIView.as_view(), name='order-list'),
    path('api/orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
    
    # ✅ Sell medicine URLs
    path("api/sell-medicine/", sell_medicine, name="sell_medicine"),
    
    # hardware stock in URLs
     path('api/update_stock/', read_rfid_and_update_stock, name='read_rfid_update_stock'),
]
