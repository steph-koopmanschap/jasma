from rest_framework import serializers
from .models.models import StreamCategory, StreamerProfile, StreamReport
from api.models.models import User
from .constants import report_reasons


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

class StreamReportSerializer(serializers.Serializer):
    # initialize fields
    report_reason = serializers.ChoiceField(
                        choices = report_reasons.CHOICES
                        )
    stream = serializers.CharField()
    profile = serializers.CharField()
    class Meta:
        model = StreamReport
        fields = ["report_reason", "stream", "profile", "created_at", "updated_at"]
