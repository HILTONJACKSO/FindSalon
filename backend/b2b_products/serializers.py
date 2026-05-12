from rest_framework import serializers
from .models import ProductCategory, Product, WholesaleOrder

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'wholesale_price', 'stock', 'image', 'category', 'category_name', 'is_active', 'created_at']

class WholesaleOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    owner_email = serializers.ReadOnlyField(source='owner.email')
    class Meta:
        model = WholesaleOrder
        fields = '__all__'
        read_only_fields = ('owner', 'total_price', 'created_at')
