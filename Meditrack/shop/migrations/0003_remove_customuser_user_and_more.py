# Generated by Django 4.2.3 on 2025-03-01 16:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_customuser_supplier_remove_medicine_batch_number_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='user',
        ),
        migrations.RemoveField(
            model_name='purchasetransaction',
            name='medicine',
        ),
        migrations.RemoveField(
            model_name='purchasetransaction',
            name='purchased_by',
        ),
        migrations.RemoveField(
            model_name='purchasetransaction',
            name='supplier',
        ),
        migrations.RemoveField(
            model_name='salestransaction',
            name='medicine',
        ),
        migrations.RemoveField(
            model_name='salestransaction',
            name='sold_by',
        ),
        migrations.RemoveField(
            model_name='stockrecord',
            name='medicine',
        ),
        migrations.RemoveField(
            model_name='stockrecord',
            name='updated_by',
        ),
        migrations.RemoveField(
            model_name='medicine',
            name='category',
        ),
        migrations.RemoveField(
            model_name='medicine',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='medicine',
            name='expiry_date',
        ),
        migrations.RemoveField(
            model_name='medicine',
            name='stock',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='address',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='email',
        ),
        migrations.AlterField(
            model_name='medicine',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='medicine',
            name='supplier',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.supplier'),
        ),
        migrations.AlterField(
            model_name='supplier',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.DeleteModel(
            name='Alert',
        ),
        migrations.DeleteModel(
            name='CustomUser',
        ),
        migrations.DeleteModel(
            name='PurchaseTransaction',
        ),
        migrations.DeleteModel(
            name='SalesTransaction',
        ),
        migrations.DeleteModel(
            name='StockRecord',
        ),
    ]
