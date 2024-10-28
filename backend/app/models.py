from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Supplier(models.Model):
    name = models.CharField(max_length=100)
    contact_info = models.TextField()

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    transaction_type = models.CharField(
        max_length=50, choices=[("sale", "Sale"), ("restock", "Restock")]
    )
    quantity = models.IntegerField()
    transaction_date = models.DateTimeField(auto_now_add=True)
