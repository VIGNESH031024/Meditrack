from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from .models import Product, Supplier, Order
from .serializers import ProductSerializer, SupplierSerializer, OrderSerializer


# ✅ CRUD API for Product
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
