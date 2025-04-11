from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db import models
from django.utils import timezone

from .models import Product, Supplier, Order, OrderItem
from .serializers import ProductSerializer, SupplierSerializer, OrderSerializer

class DashboardStatsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Calculate total products
        total_products = Product.objects.count()

        # Get low stock items (e.g., items with quantity < 10)
        low_stock_items = Product.objects.filter(quantity__lt=10).count()

        # Get expiring soon items (e.g., items expiring within 30 days)
        expiring_items = Product.objects.filter(expiryDate__lte=timezone.now() + timezone.timedelta(days=30)).count()

        # Get pending orders (e.g., orders that are not completed)
        pending_orders = Order.objects.filter(status="pending").count()

        data = {
            "totalProducts": total_products,
            "lowStockItems": low_stock_items,
            "expiringItems": expiring_items,
            "pendingOrders": pending_orders,
        }

        return Response(data, status=status.HTTP_200_OK)

# recent orders API for dashboard

class RecentOrdersView(APIView):
    def get(self, request):
        try:
            recent_orders = Order.objects.order_by('-created_at')[:10]  # Fetch latest 10 orders
            serializer = OrderSerializer(recent_orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        

        
        
class ProductListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        is_bulk = isinstance(request.data, list)
        serializer = ProductSerializer(data=request.data, many=is_bulk)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ✅ CRUD API for Supplier
class SupplierListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data)

    def post(self, request):
        is_bulk = isinstance(request.data, list)
        serializer = SupplierSerializer(data=request.data, many=is_bulk)

        if serializer.is_valid():
            # Extract product IDs from request data
            all_product_ids = set()
            if is_bulk:
                for supplier in request.data:
                    all_product_ids.update(supplier.get("products", []))
            else:
                all_product_ids = set(request.data.get("products", []))

            # Check if all product IDs exist in the database
            existing_products = set(Product.objects.filter(id__in=all_product_ids).values_list("id", flat=True))
            missing_products = all_product_ids - existing_products

            if missing_products:
                return Response(
                    {"error": f"Invalid product IDs: {list(missing_products)} - object(s) do not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupplierDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data)

    def put(self, request, pk):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        supplier = get_object_or_404(Supplier, pk=pk)
        supplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ✅ CRUD API for Order
class OrderListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Check if request contains multiple or single objects
        is_bulk = isinstance(request.data, list)
        
        # Ensure supplier is passed as an ID (not an object)
        if is_bulk:
            for order in request.data:
                if not isinstance(order.get("supplier"), int):
                    return Response(
                        {"error": "Supplier must be provided as an integer (ID)."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        else:
            if not isinstance(request.data.get("supplier"), int):
                return Response(
                    {"error": "Supplier must be provided as an integer (ID)."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Serialize and validate
        serializer = OrderSerializer(data=request.data, many=is_bulk)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class OrderDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def get_product_by_sku(request):
    if request.method != "GET":  # ✅ Allow only GET requests
        return JsonResponse({"error": "Method not allowed"}, status=405)

    sku = request.GET.get("sku")
    
    if not sku:
        return JsonResponse({"error": "SKU parameter is required"}, status=400)

    try:
        product = get_object_or_404(Product, sku=sku)  # ✅ Fetch product by SKU

        data = {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "price": product.price,
            "quantity": product.quantity,
            "category": product.category.name if hasattr(product.category, "name") else product.category,  # ✅ Fix category attribute
            "manufacturer": product.manufacturer.name if hasattr(product.manufacturer, "name") else product.manufacturer
        }

        return JsonResponse(data, safe=False, status=200)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from .models import Product, SalesData

@csrf_exempt
def sell_medicine(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        medicines = data.get("medicines", [])

        if not medicines:
            return JsonResponse({"error": "No medicines provided"}, status=400)

        # First loop: validation
        for med in medicines:
            sku = med.get("sku")
            quantity = int(med.get("quantity", 1))

            product = Product.objects.filter(sku=sku).first()

            if not product:
                return JsonResponse({"error": f"Product with SKU {sku} not found"}, status=404)

            if product.quantity < quantity:
                return JsonResponse({
                    "error": f"Not enough stock for {product.name}. Available: {product.quantity}, Requested: {quantity}"
                }, status=400)

        # Second loop: process sale & save to SalesData
        for med in medicines:
            sku = med.get("sku")
            quantity = int(med.get("quantity", 1))
            product = Product.objects.get(sku=sku)

            product.quantity -= quantity
            product.save()

            revenue = quantity * float(product.price)
            SalesData.objects.create(
                product=product,
                quantity_sold=quantity,
                revenue=revenue
            )

        return JsonResponse({"message": "Medicines sold and stock updated successfully!"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
def read_rfid_and_update_stock(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            rfid_tag = data.get('sku')
            quantity = data.get('quantity', 1)
            supplier_id = data.get('supplier_id')  # optional if you want to link
            print(rfid_tag)
            # Assuming RFID tag is mapped to a product SKU
            product = Product.objects.filter(sku=rfid_tag).first()
            if not product:
                return JsonResponse({'error': 'Product with this RFID tag not found'}, status=404)

            # Update product stock
            product.quantity += quantity
            product.save()

            # Optionally, create an order entry (if desired)
            if supplier_id:
                supplier = get_object_or_404(Supplier, id=supplier_id)
                order = Order.objects.create(
                    supplier=supplier,
                    status='approved',
                    total_amount=product.cost_price * quantity,
                    payment_status='paid',
                    expected_delivery=timezone.now().date()
                )
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    unit_price=product.cost_price,
                    total_price=product.cost_price * quantity
                )

            return JsonResponse({'success': True, 'message': 'Stock updated successfully.'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta, date
from .models import Product
from .serializers import StockAlertSerializer
from .models import StockAlert  # Optional: if you're using a separate model

class StockAlertsView(APIView):
    def get(self, request):
        today = date.today()
        expiry_threshold = today + timedelta(days=90)

        # Get products that are either low in stock or expiring soon
        low_stock_products = Product.objects.filter(quantity__lte=models.F('reorderLevel'))
        expiring_soon_products = Product.objects.filter(expiryDate__lte=expiry_threshold)

        # Combine both querysets using union (distinct results)
        alert_products = (low_stock_products | expiring_soon_products).distinct()

        # Construct custom alert response with expiry and stock info
        alerts = []
        for product in alert_products:
            alert = {
                'id': product.id,
                'name': product.name,
                'quantity': product.quantity,
                'reorderLevel': product.reorderLevel,
                'expiryDate': product.expiryDate,
                'daysToExpiry': (product.expiryDate - today).days,
                'isLowStock': product.quantity <= product.reorderLevel,
                'isExpiringSoon': product.expiryDate <= expiry_threshold,
            }
            alerts.append(alert)

        return Response(alerts, status=status.HTTP_200_OK)



from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Sum
from .models import SalesData
from .serializers import SalesDataSerializer
from datetime import timedelta
from django.utils import timezone


# 1. Generic CRUD ViewSet
class SalesDataViewSet(viewsets.ModelViewSet):
    queryset = SalesData.objects.all().order_by('-date')
    serializer_class = SalesDataSerializer


# 2. Sales overview grouped by date for chart
@api_view(['GET'])
def sales_chart_data(request):
    today = timezone.now().date()
    start_date = today - timedelta(days=7)  # Last 7 days

    queryset = (
        SalesData.objects
        .filter(date__gte=start_date)
        .values('date')
        .annotate(
            revenue=Sum('revenue'),
            units=Sum('quantity_sold')
        )
        .order_by('date')
    )

    return Response(queryset)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product, SalesData

@api_view(['POST'])
def record_sale(request):
    try:
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 0))

        product = Product.objects.get(id=product_id)

        if quantity <= 0:
            return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

        if quantity > product.quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate revenue and update stock
        revenue = quantity * float(product.price)
        product.quantity -= quantity
        product.save()

        # Save to SalesData
        SalesData.objects.create(
            product=product,
            quantity_sold=quantity,
            revenue=revenue
        )

        return Response({'message': 'Sale recorded successfully'}, status=status.HTTP_201_CREATED)

    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def top_selling_products(request):
    # Step 1: Aggregate total quantity sold per product
    top_selling = (
        SalesData.objects
        .values('product')  # Group by product
        .annotate(soldUnits=Sum('quantity_sold'))  # Sum up units sold
        .order_by('-soldUnits')[:5]  # Top 5
    )

    # Step 2: Construct results
    result = []
    for item in top_selling:
        try:
            product = Product.objects.get(id=item['product'])
            result.append({
                'product': ProductSerializer(product).data,
                'soldUnits': item['soldUnits']
            })
        except Product.DoesNotExist:
            continue

    return Response(result, status=status.HTTP_200_OK)