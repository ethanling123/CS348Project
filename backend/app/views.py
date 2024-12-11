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
from .models import Product, Category, Supplier
from .serializers import (
    ProductSerializer, 
    CategorySerializer, 
    SupplierSerializer
)
from .db_reports import execute_low_stock_report, execute_product_report

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

@api_view(['GET'])
def low_stock_report(request):
    threshold = request.GET.get('threshold', 5)
    try:
        threshold = int(threshold)
    except (TypeError, ValueError):
        threshold = 5
        
    low_stock_products = execute_low_stock_report(threshold)
    return Response(low_stock_products)

@api_view(['GET'])
def product_report(request):
    category_id = request.GET.get('category')
    supplier_id = request.GET.get('supplier')
    min_stock = int(request.GET.get('min_stock', 0))
    max_stock = int(request.GET.get('max_stock', 9999))

    data = execute_product_report(
        category_id=category_id,
        supplier_id=supplier_id,
        min_stock=min_stock,
        max_stock=max_stock
    )
    
    return Response(data)