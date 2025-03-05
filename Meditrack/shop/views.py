from django.http import JsonResponse
from rest_framework import status

from datetime import timedelta
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Medicine,MedicineOrder
from .serializers import MedicineSerializer,MedicineOrderSerializer



medicines = [
    {"id": 1, "name": "Paracetamol", "quantity": 100},
    {"id": 2, "name": "Amoxicillin", "quantity": 50},
]

inventory = [
    {"id": 1, "medicine": "Paracetamol", "stock": 100},
    {"id": 2, "medicine": "Amoxicillin", "stock": 50},
]

# List all medicines
def medicine_list(request):
    return JsonResponse(medicines, safe=False)

# Get details of a specific medicine
def medicine_detail(request, id):
    medicine = next((m for m in medicines if m["id"] == id), None)
    return JsonResponse(medicine if medicine else {"error": "Not found"}, safe=False)


def inventory_list(request):
    return JsonResponse(inventory, safe=False)


def inventory_detail(request, id):
    item = next((i for i in inventory if i["id"] == id), None)
    return JsonResponse(item if item else {"error": "Not found"}, safe=False)

@api_view(['GET'])
def expiring_soon(request):
    today = now().date()
    threshold_date = today + timedelta(days=30)  # Medicines expiring in the next 30 days
    expiring_medicines = Medicine.objects.filter(expiry_date__lte=threshold_date)
    
    serializer = MedicineSerializer(expiring_medicines, many=True)
    return Response(serializer.data)



# ✅ Place an Order (POST) & View All Orders (GET)
@api_view(['GET', 'POST'])
def order_list(request):
    if request.method == 'GET':
        orders = MedicineOrder.objects.all()
        serializer = MedicineOrderSerializer(orders, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MedicineOrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Get, Update, or Cancel an Order (GET, PUT, DELETE)
@api_view(['GET', 'PUT', 'DELETE'])
def order_detail(request, pk):
    try:
        order = MedicineOrder.objects.get(pk=pk)
    except MedicineOrder.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MedicineOrderSerializer(order)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MedicineOrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        order.status = "Cancelled"
        order.save()
        return Response({"message": "Order cancelled successfully"}, status=status.HTTP_204_NO_CONTENT)