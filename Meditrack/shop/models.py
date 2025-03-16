from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import timedelta, date
from django.utils.timezone import now
import uuid

# Default expiry date (1 year from today)
def default_expiry_date():
    return date.today() + timedelta(days=365)


# Custom User Model
class User(AbstractUser):
    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="shop_user_set",  # ✅ Avoids conflicts
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="shop_user_permissions_set",  # ✅ Avoids conflicts
        blank=True,
    )

    def __str__(self):
        return self.username


# Product Model
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, unique=True)
    batchNumber = models.CharField(max_length=50)
    expiryDate = models.DateField(default=default_expiry_date)  # ✅ Default expiry date
    manufacturer = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)  # ✅ Default value
    reorderLevel = models.IntegerField(default=0)  # ✅ Default value
    location = models.CharField(max_length=255, blank=True, null=True)
    image = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# Supplier Model
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, default="Unknown Person")  # ✅ Set default
    email = models.EmailField(default="")

    phone = models.CharField(max_length=20,default="")
    address = models.CharField(max_length=255, default="Unknown Address")

    products = models.ManyToManyField(Product, related_name='suppliers')

    def __str__(self):
        return self.name


# Order and OrderItem Models
from django.db import models

from django.db import models

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    ]
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('partial', 'Partial')
    ]

    order_number = models.CharField(
        max_length=20, unique=True, editable=False, default="TEMP0001"
    )
    supplier = models.ForeignKey('Supplier', on_delete=models.CASCADE, default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(default=now) 
    updated_at = models.DateTimeField(auto_now=True)
    expected_delivery = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.order_number == "TEMP0001" or not self.order_number:
            last_order = Order.objects.order_by("-id").first()
            next_order_number = f"ORD{(last_order.id + 1) if last_order else 1:04d}"
            self.order_number = next_order_number
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)  # ✅ Default value
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)


# Notification Model
class Notification(models.Model):
    TYPE_CHOICES = [
        ("low-stock", "Low Stock"),
        ("expiry", "Expiry"),
        ("order", "Order"),
        ("delivery", "Delivery"),
        ("system", "System"),
    ]
    type = models.CharField(
        max_length=50, choices=TYPE_CHOICES, default="system"
    )  # ✅ Meaningful default
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.URLField(blank=True, null=True)


# Dashboard Stats Model
class DashboardStats(models.Model):
    total_products = models.IntegerField(default=0)  # ✅ Default value
    low_stock_items = models.IntegerField(default=0)  # ✅ Default value
    expiring_items = models.IntegerField(default=0)  # ✅ Default value
    pending_orders = models.IntegerField(default=0)  # ✅ Default value
    created_at = models.DateTimeField(auto_now_add=True)


# Sales Data Model
class SalesData(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_sold = models.IntegerField(default=0)  # ✅ Default value
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.quantity_sold} sold"


# Stock Alert Model
class StockAlert(models.Model):
    ALERT_TYPES = [
        ("low-stock", "Low Stock"),
        ("expiry", "Expiry Warning"),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    days_to_expiry = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} - {self.alert_type}"
