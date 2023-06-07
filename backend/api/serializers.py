from api.models import Post, Hashtag, User, UserProfile, UserNotificationPreferences, Comment
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="id", read_only=True)

    class Meta:
        model = User
        fields = ("user_id", "username", "email", "password")


class UserSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="id", read_only=True)

    class Meta:
        model = User
        fields = ("user_id", "username", "email", "user_role")


class UserFullSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="id", read_only=True)

    class Meta:
        model = User
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    user_profile_id = serializers.PrimaryKeyRelatedField(
        source="id", read_only=True)
    user_id = serializers.UUIDField(source="user.id", read_only=True)

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


class UserNotificationPreferences(serializers.ModelSerializer):
    user_notification_preferences_id = serializers.PrimaryKeyRelatedField(
        source="id", read_only=True)
    user_id = serializers.UUIDField(source="user.id", read_only=True)

    class Meta:
        model = UserNotificationPreferences
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    comment_id = serializers.PrimaryKeyRelatedField(
        source="id", read_only=True)
    user_id = serializers.UUIDField(source="user.id", read_only=True)
    post_id = serializers.UUIDField(source="post.id", read_only=True)

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


class PostSerializer(serializers.ModelSerializer):
    post_id = serializers.PrimaryKeyRelatedField(source="id", read_only=True)
    user_id = serializers.UUIDField(source="user.id", read_only=True)

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


class HashtagSerializer(serializers.ModelSerializer):
    hashtag = serializers.CharField(source="id")

    class Meta:
        model = Hashtag
        fields = ["hashtag"]
