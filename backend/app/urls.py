from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    CategoryViewSet,
    SupplierViewSet,
    TransactionViewSet,
    low_stock_report,
    product_report,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reports/low-stock/', low_stock_report, name='low_stock_report'),
    path('reports/products/', product_report, name='product_report'),  
]
