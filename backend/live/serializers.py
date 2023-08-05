from rest_framework import serializers
from .models.models import StreamCategory

class StreamCategorySerializer(serializers.ModelSerializer):
   
    class Meta:
        model = StreamCategory
        fields = ["title", "color_hex", "category_img"]
        
