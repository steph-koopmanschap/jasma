from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from api.models import User, Post, Hashtag, SubscribedHashtag
from django.db.models import Count
from django.db import connection
from django.db.models import Q
from api.constants import user_roles, relationships, genders
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.request import Request

#
# Views for getting analytics about JASMA
#

@api_view(["GET"])
def get_count_current_users_by_role(request, role):
    if role not in user_roles.LIST:
        data = {'success': False, "message": f"The role: {role} does not exist."}
        return Response(data, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    user_count = User.objects.filter(user_role=role).count()
    data = {'success': True, "total_users": user_count, "role": role, "timestamp": datetime.now()}
    return Response(data, status=status.HTTP_200_OK)

# Returns the user_id and username of the top Y users ordered from high to low
# most active in the last X hours
# Limit Y = 100
# Limit X = 48 hours
# Most active is defined as combination of created posts and comments
@api_view(["GET"])
def get_most_active_users(request):
    limit_users = int(request.GET.get('limit_users', 0))
    limit_hours = int(request.GET.get('limit_hours', 0))
    # Limit constrictions
    if limit_users > 100:
        limit_users = 100
    if limit_hours > 48:
        limit_hours = 48
    time_threshold = datetime.now() - timedelta(hours=limit_hours)

    # Query the users and annotate their activity count
    users = User.objects.annotate(
        activity_count=Count('post') + Count('comment')
    ).filter(
        Q(post__created_at__gte=time_threshold) | Q(comment__created_at__gte=time_threshold)
    ).order_by('-activity_count')[:limit_users]
    # Response data
    most_active_users = [
            {   "user_id": user.id, 
                "username": user.username, 
                "activity_count": user.activity_count
            }
        for user in users
        ]
    data = {'success': True, 'most_active_users': most_active_users, 'timestamp': datetime.now()}
    return Response(data, status=status.HTTP_200_OK)

# Get the top 100 users with the most created ads
# Returns user_id, username, and email
@api_view(["GET"])
def get_users_most_ads():
    users = User.objects.annotate(num_ads=Count('ad')).order_by('-num_ads')[:100]
    top_users = [
        {
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        }
        for user in users
    ]
    data = {'success': True, "top_users": top_users, 'timestamp': datetime.now()}
    return Response(data, status=status.HTTP_200_OK)

# If time is added get total posts in the last X hours
# If no time is added get total of all posts
@api_view(["GET"])
def get_count_current_posts(request):
    limit_hours = int(request.GET.get('limit_hours', 0))
    if limit_hours == 0:
        post_count = Post.objects.all().count()
    else:
        time_threshold = datetime.now() - timedelta(hours=limit_hours)
        post_count = Post.objects.filter(created_at__gte=time_threshold).count()
    data = {"success": True, "post_count": post_count, "timestamp": datetime.now()}
    return Response(data, status=status.HTTP_200_OK) 

@api_view(["GET"])
def get_database_size(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_size_pretty(pg_database_size(current_database()))")
            db_size = cursor.fetchone()[0]
        data = {"success": True, "database_size": db_size, "timestamp": datetime.now()}
        return Response(data, status=status.HTTP_200_OK) 
    except Exception("Internal error") as e:
        data = {"success": True, "message": e}
        return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get the most frequently used total hashtags ordered from highest to lowest if limit_hours is 0.
# If limit_hours is an integer get the count of the last limit_hours.
@api_view(["GET"])
def get_top_hashtags(request):
    limit = int(request.GET.get('limit', 1))
    limit_hours = int(request.GET.get('limit_hours', 0))
    # No more than 1000 hashtags per request
    if limit > 1000:
        limit = 1000

    if limit_hours == 0:
        hashtags = Hashtag.objects.annotate(
            num_posts=Count('posts')
        ).order_by('-num_posts')[:limit]
    else:
        time_threshold = datetime.now() - timedelta(hours=limit_hours)
        hashtags = Hashtag.objects.annotate(
            num_posts=Count('posts', filter=Q(posts__created_at__gte=time_threshold))
        ).order_by('-num_posts')[:limit]

    top_hashtags = [{"hashtag": hashtag.hashtag, "count": hashtag.num_posts} for hashtag in hashtags]
    data = {'success': True, "top_hashtags": top_hashtags, "timestamp": datetime.now()}
    return Response(data, status=status.HTTP_200_OK)

# Get a single hashtag with a count of how many times it appears if limit_hours is 0.
# If limit_hours is an integer get the count of the last limit_hours.
@api_view(["GET"])
def get_hashtag_count(request, hashtag):
    limit_hours = int(request.GET.get('limit_hours', 0))
    if len(hashtag) < 3 or len(hashtag) > 50:
        data = {'success': False, "message": "Hashtags with less than 3 characters or more than 50 characters are not allowed."}
        return Response(data, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    if limit_hours == 0:
        hashtag_count = Post.objects.filter(hashtags__hashtag=hashtag).aggregate(
            count=Count('hashtags__hashtag'))
    else:
        time_threshold = datetime.now() - timedelta(hours=limit_hours)
        hashtag_count = Post.objects.filter(hashtags__hashtag=hashtag, created_at__gte=time_threshold).count()
    data = {'success': True, "hashtag": hashtag, "count": hashtag_count['count'], "timestamp": datetime.now()}
    return Response(data, status=status.HTTP_200_OK)

# Return the time when a hashtag was first created
@api_view(["GET"])
def get_hashtag_first_appeared(request, hashtag):
    if len(hashtag) < 3 or len(hashtag) > 50:
        data = {'success': False, "message": "Hashtags with less than 3 characters or more than 50 characters are not allowed."}
        return Response(data, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    try:
        hashtag_obj = Hashtag.objects.get(hashtag=hashtag)
        first_appeared = hashtag_obj.created_at
    except Hashtag.DoesNotExist:
        data = {'success': False, "message": f"The hashtag '{hashtag}' does not exist."}
        return Response(data, status=status.HTTP_404_NOT_FOUND)
    data = {'success': True, "hashtag": hashtag, "first_appeared_at": first_appeared}
    return Response(data, status=status.HTTP_200_OK)

