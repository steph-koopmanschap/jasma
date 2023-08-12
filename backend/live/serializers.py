from rest_framework import serializers
from .models.models import StreamCategory, StreamerProfile, StreamReport, StreamerSettings, StreamLive
from .constants import report_reasons, ban_reasons




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


class ToggleBanSeriazlizer(serializers.ModelSerializer):
    last_ban_reason = serializers.ChoiceField(choices = ban_reasons.CHOICES)

    class Meta:
        model = StreamerProfile
        fields = ["last_ban_reason"]

class DeactivateReasonSerializer(serializers.ModelSerializer):

    class Meta:
        model = StreamerProfile
        fields = ["deactivate_reason_description"]

        
class StreamerSettingsSerializer(serializers.ModelSerializer):

    # banned_chat_users = serializers.ManyRelatedField(many=False, read_only=True)
    next_stream_category = serializers.UUIDField()

    class Meta:
        model = StreamerSettings
        exclude = ["banned_chat_users", "profile"]
        # fields = "__all__"
        extra_kwargs = {"next_stream_category": {"required": False, "allow_null": True}}

class StreamerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    profile_settings = StreamerSettingsSerializer(read_only=True)
    
    
    class Meta:
        model = StreamerProfile
        exclude = ["followed_by"]
    

class StreamerProfileSerializerFull(StreamerProfileSerializer):
    reported = StreamReportSerializer(many=True, read_only=True)
    
    class Meta:
        model = StreamerProfile
        fields = "__all__"



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