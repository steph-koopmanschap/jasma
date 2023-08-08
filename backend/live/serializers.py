from rest_framework import serializers
from .models.models import StreamCategory, StreamerProfile, StreamReport, StreamerSettings, StreamLive
from .constants import report_reasons




class StreamCategorySerializerUpdate(serializers.ModelSerializer):
    # id = StringUUIDField(read_only=True)

    class Meta:
        model = StreamCategory
        fields = ["title", "color_hex", "category_img"]
    
class StreamCategorySerializerGet(serializers.ModelSerializer):
    # id = StringUUIDField(read_only=True)
    pass

    class Meta:
        model = StreamCategory
        fields = "__all__"
    

class StreamLiveSerializerUpdate(serializers.ModelSerializer):

    class Meta:
        model = StreamLive
        fields = ["category", "title"]

class StreamReportSerializer(serializers.ModelSerializer):
   
    pass
    
    class Meta:
        model = StreamReport
        fields = ["report_reason", "reported_stream", "reported_profile", "created_at", "updated_at"]
        extra_kwargs = {"reported_profile": {"required": False, "allow_null": True}}

    # def create(self, validated_data):
    #     validated_data.pop("issued_by")
    #     report = StreamReport.objects.create(**validated_data)
        
    #     return report
    

class StreamerSettingsSerializer(serializers.ModelSerializer):

    next_stream_category = serializers.UUIDField()

    class Meta:
        model = StreamerSettings
        fields = ["next_stream_title", "next_stream_category"]
        extra_kwargs = {"next_stream_category": {"required": False, "allow_null": True}}

class StreamerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    profile_settings = StreamerSettingsSerializer(many=False, read_only=True)
    reported = StreamReportSerializer(many=True, read_only=True)
    
    
    class Meta:
        model = StreamerProfile
        fields = "__all__"
    
    def create(self, validated_data):
        validated_data.pop("profile_settings")
        validated_data.pop("reported")
        profile = StreamerProfile.objects.create(**validated_data)
        
        return profile



class StreamLiveSerializer(serializers.ModelSerializer):
    streamer = StreamerProfileSerializer(many=False, read_only=True)
    category = StreamCategorySerializerGet(many=False, read_only=True)

    class Meta:
        model = StreamLive
        fields = "__all__"


class StreamReportSerializerGet(serializers.ModelSerializer):
    # initialize fields
    issued_by = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    report_reason = serializers.ChoiceField(choices = report_reasons.CHOICES)
    reported_stream = StreamLiveSerializer(many=False, read_only=True)
    reported_profile = StreamerProfileSerializer(many=False, read_only=True)
    class Meta:
        model = StreamReport
        fields = ["issued_by", "report_reason", "reported_stream", "reported_profile", "created_at", "updated_at"]

# Report fields serializer
StreamReportSerializer.issued_by = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
StreamReportSerializer.report_reason = serializers.ChoiceField(choices = report_reasons.CHOICES)
StreamReportSerializer.reported_stream = StreamLiveSerializer(many=False, read_only=True)
StreamReportSerializer.reported_profile = StreamerProfileSerializer(many=False, read_only=True)

# Categorty fields serializer
StreamCategorySerializerGet.current_streams = StreamLiveSerializer(many=True, read_only=True)