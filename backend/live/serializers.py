from rest_framework import serializers
from .models.models import StreamCategory, StreamerProfile
from api.models.models import User

class StreamCategorySerializerUpdate(serializers.ModelSerializer):
    # id = StringUUIDField(read_only=True)

    class Meta:
        model = StreamCategory
        fields = ["title", "color_hex", "category_img"]
    
class StreamCategorySerializerGet(serializers.ModelSerializer):
    # id = StringUUIDField(read_only=True)

    class Meta:
        model = StreamCategory
        fields = "__all__"
    

class StreamerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    class Meta:
        model = StreamerProfile
        fields = "__all__"