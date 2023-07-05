from django.db.models import Model

from api.models import Ad, Post, Hashtag, User, UserProfile, UserNotificationPreferences, Comment, Transaction, BookmarkedPost, Following, SubscribedHashtag
from rest_framework import serializers


# Field serializer
class StringUUIDField(serializers.UUIDField):
    """ 
    Use this field serializer to change the serialization behaviour of UUID fields. 

    UUID will serialized as a string.
    """

    def to_representation(self, value):
        if value is not None:
            if isinstance(value, Model):
                return str(getattr(value, "pk", None))
            return str(value)

# Model Serializer template
class JasmaModelSerializer(serializers.ModelSerializer):
    # Was created for the formating of response.
    # It was a bad idea in the end
    # I kept here in case we need it as all serializer already inherit from it.
    ...
    # NOTE: This was a bad idea :/


# USER serializers
class UserAuthenticationSerializer(JasmaModelSerializer):
    """
    Serializer to be used for the authentication process.

    Particularity:
    - Only returns "id", "username", "user_role"
    - Will accept "password" and "email"

    """
    id = StringUUIDField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "user_role", "password", "email"]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'write_only': True},
        }


class UserProfileSerializer(JasmaModelSerializer):
    # Note user is the PK of this model
    user = StringUUIDField()
    relationship_with = StringUUIDField() # TODO: Review if many2many

    class Meta:
        model = UserProfile
        fields = "__all__"


class UserNotificationPreferencesSerializer(JasmaModelSerializer):
    # Note user is the PK of this model
    user = StringUUIDField()

    class Meta:
        model = UserNotificationPreferences
        fields = "__all__"


class CommentSerializer(JasmaModelSerializer):
    id = StringUUIDField()
    user = StringUUIDField()
    post = StringUUIDField()

    class Meta:
        model = Comment
        fields = "__all__"


class PostSerializer(JasmaModelSerializer):
    id = StringUUIDField()
    user= StringUUIDField()
    

    class Meta:
        model = Post
        fields = "__all__"


class AdSerializer(JasmaModelSerializer):
    id = StringUUIDField()

    class Meta:
        model = Ad
        fields = "__all__"


class TransactionSerializer(JasmaModelSerializer):
    id = StringUUIDField()

    class Meta:
        model = Transaction
        fields = "__all__"


class HashtagSerializer(JasmaModelSerializer):
    hashtag = serializers.CharField(source="id")

    class Meta:
        model = Hashtag
        fields = ["hashtag"]


class BookmarkedPostSerializer(JasmaModelSerializer):
    id = StringUUIDField()
    post = StringUUIDField()
    user = StringUUIDField()

    class Meta:
        model = BookmarkedPost
        fields = "__all__"


class FollowingSerializer(JasmaModelSerializer):
    followee = StringUUIDField()

    class Meta:
        model = Following
        fields = ["followee"]


class FollowersSerializer(JasmaModelSerializer):
    follower = StringUUIDField()

    class Meta:
        model = Following
        fields = ["follower"]


class SubscribedHashtagSerializer(JasmaModelSerializer):
    user = StringUUIDField()
    hashtag = StringUUIDField()

    class Meta:
        model = SubscribedHashtag
        fields = "__all__"

class UserFullSerializer(JasmaModelSerializer):
    """ 
    To be used when we want complete user information of depth=1. 

    """
    id = StringUUIDField()
    profile = UserProfileSerializer()
    notification_preferences = UserNotificationPreferencesSerializer()

    class Meta:
        model = User
        exclude = ["password"]
        depth = 1


class UserCustomSerializer(UserFullSerializer):
    posts = PostSerializer(many=True)
    bookmarked_posts = BookmarkedPostSerializer(many=True)
    comments = CommentSerializer(many=True)
    ads = AdSerializer(many=True)
    transactions = TransactionSerializer(many=True)
    following = FollowingSerializer(many=True)
    followers = FollowersSerializer(many=True)
    sucribed_hashtags = SubscribedHashtagSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Fields to always include
        automatic_fields = {
            "id",
            "username",
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
