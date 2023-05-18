import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, get_wrapper, delete_wrapper
from api.constants.http_status import HTTP_STATUS
from api.models import User, Post, Hashtag, SubscribedHashtag
from django.db.models import Count

# Get the most frequently used hashtags ordered from highest to lowest
@get_wrapper
def get_top_hashtags(request):
    limit = int(request.GET.get('limit', 1))
    # No more than 1000 hashtags per request
    if limit > 1000:
        limit = 1000

    hashtags = Hashtag.objects.annotate(num_posts=Count('posts')).order_by('-num_posts')[:limit]
    top_hashtags = [{"hashtag": hashtag.hashtag, "count": hashtag.num_posts} for hashtag in hashtags]
    return JsonResponse({'success': True, "top_hashtags": top_hashtags},
                        status=HTTP_STATUS["OK"])

# Get a single hashtag with a count of how many times it appears.
@get_wrapper
def get_hashtag_count(request, hashtag):
    if len(hashtag) < 3 or len(hashtag) > 50:
        return JsonResponse({'success': False, "message": "Hashtags with less than 3 characters or more than 50 characters are not allowed."},
                            status=HTTP_STATUS["Unprocessable Content"])

    hashtag_count = Post.objects.filter(hashtags__hashtag=hashtag).aggregate(count=Count('hashtags__hashtag'))
    return JsonResponse({'success': True, "hashtag": hashtag, "count": hashtag_count['count']},
                        status=HTTP_STATUS["OK"])

@login_required
@get_wrapper
def get_subscribed_hashtags(request):
    try: 
        user = request.user
        subscribed_hashtags = SubscribedHashtag.objects.filter(user=user).values_list('hashtag__hashtag', flat=True)
        return JsonResponse({'success': True, "hashtags": subscribed_hashtags},
                            status=HTTP_STATUS["OK"])
    except Exception as e:
        print(e)
        return JsonResponse({'success': False, "message": "Could not retrieve hashtags."},
                            status=HTTP_STATUS["Internal Server Error"])

# User subscribes to hashtags so that posts with that hashtag will be viewed in the newsfeed more often.
@csrf_exempt
@login_required
@post_wrapper
def subscribe_to_hashtags(request):
    user = request.user
    req = json.loads(request.body)
    hashtags = req['hashtags']

    # No more than 100 hashtags allowed per request.
    if len(hashtags) > 100:
        hashtags = hashtags[:100]

    non_existing_hashtags = []
    try:
        for hashtag in hashtags:
            # Check if the hashtag already exists.
            hashtag_already_exists = Hashtag.objects.filter(hashtag=hashtag).exists()
            if not hashtag_already_exists:
                non_existing_hashtags.append(hashtag)
            else:
                SubscribedHashtag.objects.create(user=user, hashtag=hashtag)
        # We also return the non existing hashtags so the client can tell the user which hashtags do not exist and can not be subscribed to.
        return JsonResponse({'success': True, 'non_existing_hashtags': non_existing_hashtags},
                            status=HTTP_STATUS["Created"])
    except Exception as e:
        print(e)
        return JsonResponse({'success': False, 'message': 'Could not subscribe to hashtags.'},
                            status=HTTP_STATUS["Internal Server Error"])

@csrf_exempt
@login_required
@delete_wrapper
def unsubscribe_from_hashtag(request, hashtag): 
    user = request.user
    req = json.loads(request.body)
    try:
        subscribed_hashtags = SubscribedHashtag.objects.filter(user=user, hashtag=hashtag)
        subscribed_hashtags.delete()
        return JsonResponse({'success': True, 'message': "Successfully unsubscribed from hashtag."},
                            status=HTTP_STATUS["OK"])
    except Exception as e:
        print(e)
        return JsonResponse({'success': False, 'message': 'Could not unsubscribe from hashtag.'},
                            status=HTTP_STATUS["Internal Server Error"])


