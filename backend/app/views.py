# Django core
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.db.models import F, Avg, Count, Q

# Django REST framework
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Local imports
from .models import Product, Category, Supplier, Transaction
from .serializers import (
    ProductSerializer, 
    CategorySerializer, 
    SupplierSerializer, 
    TransactionSerializer
)

# Standard library
import json

# ViewSets for API Endpoints
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

@api_view(['GET'])
def low_stock_report(request):
    # Filter products with stock_quantity < 5
    low_stock_products = Product.objects.filter(stock_quantity__lt=5).values('id', 'name', 'stock_quantity')
    return Response(low_stock_products)

@api_view(['GET'])
def product_report(request):
    category_id = request.GET.get('category')
    supplier_id = request.GET.get('supplier')
    min_stock = request.GET.get('min_stock', 0)
    max_stock = request.GET.get('max_stock', 9999)

    # Build filters dynamically based on query parameters
    filters = Q(stock_quantity__gte=min_stock) & Q(stock_quantity__lte=max_stock)
    if category_id:
        filters &= Q(category_id=category_id)
    if supplier_id:
        filters &= Q(supplier_id=supplier_id)

    # Query products with related category and supplier data
    filtered_products = Product.objects.filter(filters).select_related('category', 'supplier').values(
        'id', 'name', 'stock_quantity', 'category__name', 'supplier__name'
    )

    statistics = Product.objects.filter(filters).aggregate(
        total_products=Count('id'),
        avg_stock=Avg('stock_quantity')
    )

    data = {
        'products': list(filtered_products),
        'statistics': statistics
    }
    return Response(data)