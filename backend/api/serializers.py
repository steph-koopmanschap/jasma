from urllib import request
from rest_framework.fields import empty
from api.models import Post, Hashtag, User, UserProfile, UserNotificationPreferences, Comment
from rest_framework import serializers


class StringUUIDField(serializers.UUIDField):
    def to_representation(self, value):
        if value:
            return str(value)
        return None


class JasmaModelSerializer(serializers.ModelSerializer):
    """Add the serialized data to the "data" keyword of the response.data."""
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            "data": dict(representation),
            "message": ""
        }

class UserRegisterSerializer(JasmaModelSerializer):
    user_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = User
        fields = ("user_id", "username", "email", "password")


class UserLoginSerializer(JasmaModelSerializer):
    user_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = User
        fields = ("user_id", "username", "email", "user_role")


class UserFullSerializer(JasmaModelSerializer):
    user_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = User
        fields = "__all__"
                  

class UserProfileSerializer(JasmaModelSerializer):
    user_profile_id = StringUUIDField(source="pk", read_only=True)
    user_id = StringUUIDField(source="user.pk", read_only=True)

    class Meta:
        model = UserProfile
        fields = (
            "user_id",
            "given_name",
            "last_name",
            "display_name",
            "bio",
            "date_of_birth",
            "gender",
            "relationship",
            "relationship_with",
            "language",
            "country",
            "city",
            "website"
        )


class UserNotificationPreferences(JasmaModelSerializer):
    user_notification_preferences_id = StringUUIDField(source="pk", read_only=True)
    user_id = StringUUIDField(source="user.id", read_only=True)

    class Meta:
        model = UserNotificationPreferences
        fields = "__all__"


class CommentSerializer(JasmaModelSerializer):
    comment_id = StringUUIDField(source="pk", read_only=True)
    user_id = StringUUIDField(source="user.pk", read_only=True)
    post_id = StringUUIDField(source="post.pk", read_only=True)

    class Meta:
        model = Comment
        fields = (
            "comment_id",
            "post_id",
            "user_id",
            "text_content",
            "file_url",
            "created_at",
            "updated_at"
        )


class PostSerializer(JasmaModelSerializer):
    post_id = StringUUIDField(source="pk", read_only=True)
    user_id = StringUUIDField(source="user.pk", read_only=True)

    class Meta:
        model = Post
        fields = (
            "post_id",
            "user_id",
            "text_content",
            "file_url",
            "post_type",
            "created_at",
            "updated_at",
            "hashtags"
        )


class HashtagSerializer(JasmaModelSerializer):
    hashtag = serializers.CharField(source="id")

    class Meta:
        model = Hashtag
        fields = ["hashtag"]
