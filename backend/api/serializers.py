from attr import fields
from api.models import Ad, Post, Hashtag, User, UserProfile, UserNotificationPreferences, Comment, Transaction, BookmarkedPost, Following
from rest_framework import serializers


# Field serializer
class StringUUIDField(serializers.UUIDField):
    """ 
    Use this field serializer to change the serialization behaviour of UUID fields. 

    UUID will serialized as a string.
    """

    def to_representation(self, value):
        if value:
            return str(value)
        return None

# Model Serializer template


class JasmaModelSerializer(serializers.ModelSerializer):
    # NOTE: This was a bad idea :/
    """Add the serialized data to the "data" keyword of the response.data."""

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     # This is to take into account related fields
    #     if self.context.get('view') is None or isinstance(self, self.context.get('view').serializer_class):
    #         return {
    #             "data": dict(representation),
    #             "message": ""
    #         }
    #     return dict(representation)


class ExcludeUserPassword(JasmaModelSerializer):
    """ 
    Use this ModelSerializer to make sure to exclude password from serialization. 

    Inherit JasmaModelSerializer
    NOTE: Not in use as I seem to have fiigured out exclude in the Meta.
    Lets keep for now just in case.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop("password")

# USER serializers


class UserRegisterSerializer(JasmaModelSerializer):
    """ 
    Serializer to be used for the registration process. 

    Particularity: allow password.
    """
    user_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = User
        fields = ["user_id", "username", "email", "password"]


class UserLoginSerializer(JasmaModelSerializer):
    """
    Serializer to be used for the registration process.

    Particularity: Only returns "user_id", "username", "email", "user_role".

    NOTE: Could be replaced by UserFullSerializer without field query.
    """
    user_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = User
        fields = ["user_id", "username", "email", "user_role"]


# TODO: Review accessible fields.
class UserProfileSerializer(JasmaModelSerializer):
    # Note user is the PK of this model
    user_profile_id = StringUUIDField(source="pk")
    relationship_with = StringUUIDField(source="relationship_with.pk")

    class Meta:
        model = UserProfile
        exclude = [
            "user",
            "job_company",
            "job_industry",
            "job_role",
            "education"
        ]


class UserNotificationPreferencesSerializer(JasmaModelSerializer):
    # Note user is the PK of this model
    user_notification_preferences_id = StringUUIDField(source="pk")

    class Meta:
        model = UserNotificationPreferences
        exclude = ["user"]


class CommentSerializer(JasmaModelSerializer):
    comment_id = StringUUIDField(source="pk", read_only=True)
    user_id = StringUUIDField(source="user.pk", read_only=True)
    post_id = StringUUIDField(source="post.pk", read_only=True)

    class Meta:
        model = Comment
        exclude = ["id", "user", "post"]


class PostSerializer(JasmaModelSerializer):
    post_id = StringUUIDField(source="pk", read_only=True)
    user_id = StringUUIDField(source="user.pk", read_only=True)

    class Meta:
        model = Post
        exclude = ["id", "user"]


class AdSerializer(JasmaModelSerializer):
    ad_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = Ad
        exclude = ["id"]


class TransactionSerializer(JasmaModelSerializer):
    transaction_id = StringUUIDField(source="pk", read_only=True)

    class Meta:
        model = Transaction
        exclude = ["id"]


class HashtagSerializer(JasmaModelSerializer):
    hashtag = serializers.CharField(source="id")

    class Meta:
        model = Hashtag
        fields = ["hashtag"]


class BookmarkedPostSerializer(JasmaModelSerializer):
    bookmarked_post_id = StringUUIDField(source="pk", read_only=True)
    post_id = StringUUIDField(source="post.pk", read_only=True)
    user_id = StringUUIDField(source="user.pk", read_only=True)

    class Meta:
        model = BookmarkedPost
        exclude = ["id", "post", "user"]


class FollowingSerializer(JasmaModelSerializer):
    followee = StringUUIDField(source="followee.pk", read_only=True)

    class Meta:
        model = Following
        fields = ["followee"]


class FollowersSerializer(JasmaModelSerializer):
    follower = StringUUIDField(source="follower.pk", read_only=True)

    class Meta:
        model = Following
        fields = ["follower"]


class UserFullSerializer(JasmaModelSerializer):
    """ 
    To be used when we want complete user information of depth=1. 

    """
    user_id = StringUUIDField(source="pk", read_only=True)
    profile = UserProfileSerializer()
    notification_preferences = UserNotificationPreferencesSerializer()

    class Meta:
        model = User
        exclude = ["id", "password"]
        depth = 1


class UserCustomSerializer(UserFullSerializer):
    posts = PostSerializer(many=True)
    bookmarked_posts = BookmarkedPostSerializer(many=True)
    comments = CommentSerializer(many=True)
    ads = AdSerializer(many=True)
    transactions = TransactionSerializer(many=True)
    following = FollowingSerializer(many=True)
    followers = FollowersSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Fields to always include
        automatic_fields = {
            "user_id",
            "username",
            "email",
            "user_role"
        }
        # All available fields from the serializer
        serializer_fields = set(self.fields.keys())
        # Extra fields to include from the request
        requested_field = set()
        context = kwargs.get("context")
        request = context.get("request") if context else None
        if request and request.query_params:
            requested_field.add(*request.query_params.getlist('fields', []))
        if "all" not in requested_field:
            # Remove fields that are not flagged to keep
            keep = automatic_fields | requested_field
            remove = serializer_fields - keep
            for field in remove:
                self.fields.pop(field)

