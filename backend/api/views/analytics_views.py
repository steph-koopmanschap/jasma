from datetime import datetime, timedelta
import calendar
from api.models import User, Post, Hashtag, UserLoginHistory, DeletedPostReference, SubscribedHashtag
from django.db.models import Count
from django.db import connection
from django.db.models import Q
from django.db.models.functions import TruncDate, ExtractHour, ExtractWeekDay
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
        payload = {'success': False, "message": f"The role: {role} does not exist."}
        return Response(payload, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    user_count = User.objects.filter(user_role=role).count()
    payload = {'success': True, "total_users": user_count, "role": role, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

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
    payload = {'success': True, 'most_active_users': most_active_users, 'timestamp': datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

# Get the total count of logins in the limit_hours hours
# TODO: # Country filtering?
@api_view(["GET"])
def get_total_login_count(request):
    # If no limit_hours is given set it to last hour
    limit_hours = int(request.GET.get('limit_hours', 1))
    # Limit the login history count to the last 48 hours
    if limit_hours > 48:
        limit_hours = 48
    time_threshold = datetime.now() - timedelta(hours=limit_hours)
    # Count the login records within the time threshold
    login_count = UserLoginHistory.objects.filter(login_time__gte=time_threshold).count()
    payload = {'success': True, 'login_count': login_count, 'timestamp': datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

# Get the average login per day, over a period of limit_days
@api_view(["GET"])
def average_logins(request):
    #If no limit_days is given set it to 1 day
    limit_days = int(request.GET.get('limit_days', 1))
    # Limit the login period to the last 30 days
    if limit_days > 30:
        limit_days = 30
    # Calculate the start and end date for the time period
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=limit_days)
    # Query the UserLoginHistory table
    login_count = UserLoginHistory.objects.filter(
        login_time__date__range=(start_date, end_date)
    ).annotate(date=TruncDate('login_time')).values('date').annotate(count=Count('id')).values('date', 'count')
    # Calculate the average logins per day
    average_logins = sum(entry['count'] for entry in login_count) / limit_days
    payload = {"success": True, "average_logins": average_logins, 'timestamp': datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

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
    payload = {'success': True, "top_users": top_users, 'timestamp': datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

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
    payload = {"success": True, "post_count": post_count, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK) 

# Returns how many posts were created on each weekday.
# And how many posts were created per hour per weekday.
# Note: This also includes count of created posts that were deleted
@api_view(["GET"])
def post_created_count_per_hour_and_weekday(request):
    limit_days = int(request.GET.get('limit_days', 7))
    # limit_days under 7 days not allowed because we get the data from a full week
    if limit_days < 7:
        limit_days = 7
    # Calculate the start and end date for the limit_day period
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=limit_days)
    # Query the Post table and group the count of posts per hour and weekday
    post_counts = Post.objects.filter(
        created_at__date__range=(start_date, end_date)
    ).annotate(hour=ExtractHour('created_at'), weekday=ExtractWeekDay('created_at')).values('hour', 'weekday').annotate(count=Count('id'))
    # Query the DeletedPostReference table and group the count of deleted posts per hour and weekday
    deleted_post_counts = DeletedPostReference.objects.filter(
        created_at__date__range=(start_date, end_date)
    ).annotate(hour=ExtractHour('created_at'), weekday=ExtractWeekDay('created_at')).values('hour', 'weekday').annotate(count=Count('id'))
    
    # Create a dictionary to store the count of posts per hour and weekday
    data = []
    for weekday in range(1, 6):
        weekday_data = {
            'day': calendar.day_name[weekday],
            'count': 0,
            'hours': []
        }
        for hour in range(24):
            weekday_data['hours'].append({'hour': str(hour).zfill(2), 'count': 0})
        data.append(weekday_data)

    # Add the counts for created posts are did not get deleted
    for entry in post_counts:
        hour = entry['hour']
        weekday = entry['weekday']
        count = entry['count']
        data[weekday - 1]['count'] += count
        data[weekday - 1]['hours'][hour]['count'] = count
    # Add the counts for created posts that got deleted
    for entry in deleted_post_counts:
        hour = entry['hour']
        weekday = entry['weekday']
        count = entry['count']
        data[weekday - 1]['deleted_count'] += count
        data[weekday - 1]['hours'][hour]['deleted_count'] = count

    payload = {"success": True, "weekday_hour_counts": data, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

# Returns the count of how many posts were deleted in the past limit_days
# Grouped by delete reason
def deleted_posts_count(request):
    limit_days = int(request.GET.get('limit_days', 1))
    if limit_days < 1:
        limit_days = 1
    # Calculate the date limit_days days ago from today
    time_threshold = datetime.now() - timedelta(days=limit_days)
    # Query the deleted posts and group them by delete_reason
    deleted_counts = (
        DeletedPostReference.objects
        .filter(deleted_at__gte=time_threshold)
        .values('delete_reason')
        .annotate(count=Count('id'))
        .order_by()
    )
    # Calculate the total count of deleted posts
    total_count = sum(count['count'] for count in deleted_counts)
    # Prepare the response
    deleted_post_counts = {
        'user deleted': 0,
        'moderator deleted': 0,
        'auto deleted': 0,
        'total': total_count
    }
    # Update the response dictionary with the counts
    for count in deleted_post_counts:
        deleted_post_counts[count['delete_reason']] = count['count']

    payload = {"success": True, "deleted_post_counts": deleted_post_counts, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_database_size(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT pg_size_pretty(pg_database_size(current_database()))")
            db_size = cursor.fetchone()[0]
        payload = {"success": True, "database_size": db_size, "timestamp": datetime.now()}
        return Response(payload, status=status.HTTP_200_OK) 
    except Exception("Internal error") as e:
        payload = {"success": False, "message": e}
        return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get the most frequently used total hashtags ordered from highest to lowest if limit_hours is 0.
# If limit_hours is an integer get the count of the last limit_hours.
# For trending hashtags set the limit_hours to 24 or 48 hours. and the limit to 10
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
    payload = {'success': True, "top_hashtags": top_hashtags, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

# Get a single hashtag with a count of how many times it appears if limit_hours is 0.
# If limit_hours is an integer get the count of the last limit_hours.
@api_view(["GET"])
def get_hashtag_count(request, hashtag):
    limit_hours = int(request.GET.get('limit_hours', 0))
    if len(hashtag) < 3 or len(hashtag) > 50:
        payload = {'success': False, "message": "Hashtags with less than 3 characters or more than 50 characters are not allowed."}
        return Response(payload, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    if limit_hours == 0:
        hashtag_count = Post.objects.filter(hashtags__hashtag=hashtag).aggregate(
            count=Count('hashtags__hashtag'))
    else:
        time_threshold = datetime.now() - timedelta(hours=limit_hours)
        hashtag_count = Post.objects.filter(hashtags__hashtag=hashtag, created_at__gte=time_threshold).count()
    payload = {'success': True, "hashtag": hashtag, "count": hashtag_count['count'], "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

# Return the time when a hashtag was first created
@api_view(["GET"])
def get_hashtag_first_appeared(request, hashtag):
    if len(hashtag) < 3 or len(hashtag) > 50:
        payload = {'success': False, "message": "Hashtags with less than 3 characters or more than 50 characters are not allowed."}
        return Response(payload, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    try:
        hashtag_obj = Hashtag.objects.get(hashtag=hashtag)
        first_appeared = hashtag_obj.created_at
    except Hashtag.DoesNotExist:
        payload = {'success': False, "message": f"The hashtag '{hashtag}' does not exist."}
        return Response(payload, status=status.HTTP_404_NOT_FOUND)
    payload = {'success': True, "hashtag": hashtag, "first_appeared_at": first_appeared}
    return Response(payload, status=status.HTTP_200_OK)

# Return how many times a user has used a specific hashtag
# if limit_hours == 0 then get most used hashtags from all time.
# if limit_hours > 1 then get most used hashtags from the past limit_hours
@api_view(["GET"])
def get_hashtags_count_user(request, hashtag, user_id):
    limit_hours = int(request.GET.get('limit_hours', 0))
    
    if limit_hours == 0:
        #Get the count of hashtag usage for the user from all time
        hashtag_count = Post.objects.filter(user_id=user_id, hashtags__id=hashtag).count()
    else:
        time_threshold = datetime.now() - timedelta(hours=limit_hours)
        # Get the count of hashtag usage for the user within the time limit
        hashtag_count = Post.objects.filter(user_id=user_id, hashtags__id=hashtag, created_at__gte=time_threshold).count()
    
    payload = {'success': True, "count": hashtag_count, "hashtag": hashtag, "user_id": user_id, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)

# Return the top most used hashtags by a specific user, as well the as the count of each hashtag.
# Ordered from highest to lowest.
# if limit_hours == 0 then get most used hashtags from all time.
# if limit_hours > 1 then get most used hashtags from the past limit_hours
# limit_hashtags is how many hashtags to list
@api_view(["GET"])
def get_top_hashtags_user(request, user_id):
    limit_hours = int(request.GET.get('limit_hours', 0))
    limit_hashtags = int(request.GET.get('limit_hashtags', 1))
    # Limit hashtags to 50
    if limit_hashtags > 50:
        limit_hashtags = 50
        
    if limit_hours == 0:
        # Get the most used hashtags for the user from all time
        hashtags = Hashtag.objects.filter(posts__user_id=user_id).annotate(num_posts=Count('posts')).order_by('-num_posts')[:limit_hashtags]
    else:
        time_threshold = datetime.now() - timedelta(hours=limit_hours)
        # Get the most used hashtags for the user within the time limit
        hashtags = Hashtag.objects.filter(posts__user_id=user_id, posts__created_at__gte=time_threshold).annotate(num_posts=Count('posts')).order_by('-num_posts')[:limit_hashtags]
    
    top_hashtags = [{"hashtag": hashtag.id, "count": hashtag.num_posts} for hashtag in hashtags]
    payload = {'success': True, "top_hashtags": top_hashtags, "user_id:": user_id, "timestamp": datetime.now()}
    return Response(payload, status=status.HTTP_200_OK)
