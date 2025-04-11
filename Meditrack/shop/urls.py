from django.urls import path
from .views import *

urlpatterns = [
    
    # ✅ dashboard URLs
    path('api/dashboard-stats/', DashboardStatsAPIView.as_view(), name='dashboard-stats'),
    path('api/dashboard-recent-orders/', RecentOrdersView.as_view(), name='dashboard-stats-detail'),
    
    
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
     
    # ✅ stockalert URLs
    path('api/dashboard-stock-alerts/', StockAlertsView.as_view(), name='dashboard-stock-alerts'),
    
    # ✅ sales data URLs
    path('api/sales/record/', record_sale, name='record-sale'),
    
    #✅top Selling Products url
     path('api/top-selling-products/', top_selling_products, name='top-selling-products'),
    
    # ✅ sales data URLs
    path('api/sales/chart-data/', sales_chart_data, name='sales-chart-data')
    
    
]
