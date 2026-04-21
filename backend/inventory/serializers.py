from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'salon', 'name', 'quantity', 'low_stock_threshold', 'last_restocked')
        read_only_fields = ('id', 'last_restocked')
