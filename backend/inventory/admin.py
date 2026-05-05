from django.contrib import admin
from .models import Product, ProductCategory

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'salon')
    list_filter = ('salon',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'salon', 'stock_status', 'price')
    list_filter = ('category', 'salon')
    search_fields = ('name', 'sku')
    
    def stock_status(self, obj):
        if obj.quantity == 0:
            return "Out of Stock"
        if obj.quantity <= obj.low_stock_threshold:
            return "Low Stock"
        return "In Stock"
