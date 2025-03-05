from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import AbstractUser, Group, Permission

# Custom User Model
class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

# Supplier Model
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=20, default="Not Provided")  # Set a default value


    def __str__(self):
        return self.name

# Default Expiry Date
def default_expiry_date():
    return timezone.now().date() + timedelta(days=365)

# Medicine Model
class Medicine(models.Model):
    CATEGORY_CHOICES = [
        ('tablet', 'Tablet'),
        ('syrup', 'Syrup'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField(default=default_expiry_date)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

# Medicine Order Model
class MedicineOrder(models.Model):
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    quantity_ordered = models.IntegerField()
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ], default='Pending')

    def __str__(self):
        return f"{self.medicine.name} - {self.status}"

# Inventory Model
class Inventory(models.Model):
    medicine = models.OneToOneField(Medicine, on_delete=models.CASCADE)
    available_stock = models.IntegerField()
    minimum_stock = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.medicine.name} - {self.available_stock} units"

# Order Model
class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"Order {self.id} - {self.medicine.name}"

# Utilization Model
class Utilization(models.Model):
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity_used = models.IntegerField()
    usage_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.medicine.name} - {self.quantity_used} used"

# Notification Model
class Notification(models.Model):
    message = models.TextField()
    status = models.CharField(max_length=10, choices=[('Read', 'Read'), ('Unread', 'Unread')], default='Unread')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message[:50]

# Audit Log Model
class AuditLog(models.Model):
    action = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"
