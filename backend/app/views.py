from rest_framework import viewsets
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import F
from .models import Product, Category, Supplier, Transaction
from .serializers import ProductSerializer, CategorySerializer, SupplierSerializer, TransactionSerializer
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
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

def inventory_dashboard(request):
    # Your dashboard logic
    return render(request, 'dashboard.html')