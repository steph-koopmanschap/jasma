import json
from django.conf import settings
from django_redis import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, put_wrapper, get_wrapper, delete_wrapper
from api.constants.http_status import HTTP_STATUS
from api.constants.times import MONTH_IN_SECONDS
from api.models import User, Post, Hashtag, Bookmarked_Post, Following, Subscribed_Hashtag
from api.utils.handle_file_save import handle_file_save
from api.utils.handle_file_delete import handle_file_delete
from api.views.notification_views import create_notification

@csrf_exempt
@login_required
@post_wrapper
def create_post(request):
    text_content = request.POST.get('text_content')
    hashtags = request.POST.getlist('hashtags')
    user = request.user
    # try post creation
    try:
        # Post contains a file
        if request.FILES:
            uploaded_file = request.FILES.get('file')
            saved_file = handle_file_save(uploaded_file, "post")
            if saved_file == False:
                return JsonResponse({'successs': False, 'message': "File upload failed."}, 
                                    status=HTTP_STATUS["Internal Server Error"])
            file_url = saved_file["URL"]
            # Deterimine the type of post based on the file type
            post_type = saved_file["file_type"]["mime_type"].split('/')[0]
        # Post has no file.
        else:
            file_url = None
            post_type = "text"
        
        post = Post.objects.create( 
                                user=user, 
                                text_content=text_content, 
                                file_url=file_url,
                                post_type=post_type)
        # Loop through the hashtags and add them to the post instance
        for tag in hashtags:
            # If the hashtag does not exist yet, create it and then get it.
            # If the hashtag already exists, get it.
            hashtag, created = Hashtag.objects.get_or_create(hashtag=tag)
            post.hashtags.add(hashtag)
        post.save()
    except Exception as e:
        # Check if a post has been created, if yes, delete it upon error.
        if 'post' in locals():
            post.delete()
        # Delete the saved file too.
        if 'saved_file' in locals():
            if saved_file != False:
                handle_file_delete(saved_file["location"])
        print(e)
        return JsonResponse({'successs': False, 'message': e.args[0]}, 
                            status=HTTP_STATUS["Internal Server Error"])
    # Create a notification towards followers of the post's user. (in Redis)
    following = Following.objects.filter(following=user).values_list('user', flat=True)
    followers_users = User.objects.filter(id__in=following).values('id')
    for follower in followers_users:
        create_notification(follower.id, {
                                    "from": user.id,
                                    "event_type": "new_post",
                                    "event_reference": post.post_id,
                                    "message": f"{user.username} published a new post."
                                    })
    # Store post in the cache
    post_formatted = Post.format_post_dict(post)
    cache.set(f"posts_{post.post_id}", post_formatted, timeout=MONTH_IN_SECONDS)

    return JsonResponse({'successs': True, 'message': "Post created successfully."}, 
                        status=HTTP_STATUS["Created"])

@csrf_exempt
@login_required
@put_wrapper
def edit_post(request):
    try:
        post_id = request.POST.get('post_id')
        post = Post.objects.get(post_id=post_id)
        old_post = post # Save the old post in case edit fails?
    except Post.DoesNotExist:
        return JsonResponse({'success': False, 'message': "Post does not exist."}, 
                            status=HTTP_STATUS["Not Found"])
    # Try edit the post
    try:
        # Update text_content if available
        text_content = request.POST.get('text_content')
        if text_content:
            post.text_content = text_content
        # Update hashtags if available
        hashtags = request.POST.getlist('hashtags')
        if hashtags:
            # Clear previous hashtags and add new ones
            post.hashtags.clear()
            for tag in hashtags:
                hashtag, created = Hashtag.objects.get_or_create(hashtag=tag)
                post.hashtags.add(hashtag)
        # Handle file upload if available
        if request.FILES:
            uploaded_file = request.FILES.get('file')
            saved_file = handle_file_save(uploaded_file, "post")
            if saved_file == False:
                return JsonResponse({'successs': False, 'message': "File upload failed."}, 
                                    status=HTTP_STATUS["Internal Server Error"])
            file_url = saved_file["URL"]
            # Determine the type of post based on the file type
            post_type = saved_file["file_type"]["mime_type"].split('/')[0]
            # If the post already contains a file, delete the old one
            if post.file_url:
                handle_file_delete(post.file_url)
        else:
            file_url = None
            post_type = "text"

        post.file_url = file_url
        post.post_type = post_type
        post.save()
    except Exception as e:
        # If there was an error revert back to the old post.
        post.text_content = old_post.text_content
        # WARNING: How do we know if the old file got deleted?
        post.file_url = old_post.file_url
        post.post_type = old_post.post_type
        post.hashtags.clear()
        post.hashtags.add(*old_post.hashtags.all())
        post.save()
        # Delete the saved file too.
        if 'saved_file' in locals():
            if saved_file != False:
                handle_file_delete(saved_file["location"])
        print(e)
        return JsonResponse({'successs': False, 'message': e.args[0]}, 
                            status=HTTP_STATUS["Internal Server Error"])
    # Delete the old post from the cache
    cache_key = f"posts_{post.post_id}"
    cache.delete(cache_key)
    # Add the updated post to the cache
    post_formatted = Post.format_post_dict(post)
    cache.set(cache_key, post_formatted, timeout=MONTH_IN_SECONDS)

    return JsonResponse({'success': True, 'message': "Post updated successfully."}, 
                    status=HTTP_STATUS["Created"])

@csrf_exempt
@login_required
@delete_wrapper
def delete_post(request, post_id):
    try: 
        post = Post.objects.get(post_id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'success': True, 'message': "Post does not exist or already deleted."}, 
                            status=HTTP_STATUS["Gone"])
    if post.file_url != None:
        delete_file = handle_file_delete(post.file_url)
    cache.delete(f"posts_{post.post_id}")
    post.delete()
    return JsonResponse({'successs': True, 'message': "Post deleted successfully."}, 
                    status=HTTP_STATUS["OK"])

@get_wrapper
def get_user_posts(request):
    user_id = request.GET.get('user_id', None)
    limit = int(request.GET.get('limit', 1))
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': "User does not exist."}, 
                            status=HTTP_STATUS["Not Found"])
    # Get the latest posts of the user with the limit.
    posts = Post.objects.filter(user=user).order_by('-created_at')[:limit]
    posts_formatted = Post.format_posts_dict(posts)

    return JsonResponse({'success': True, 'posts': posts_formatted},
                        status=HTTP_STATUS["OK"])

@get_wrapper
def get_single_post(request, post_id):
    try:
        post = Post.objects.get(post_id=post_id)
        post_formatted = Post.format_post_dict(post)
    except Post.DoesNotExist:
        return JsonResponse({'success': False, 'message': "Post does not exist."}, 
                            status=HTTP_STATUS["Not Found"])
    return JsonResponse({'success': True, 'post': post_formatted},
                        status=HTTP_STATUS["OK"]) 

# Get mulitple specific posts by passing in an array of post_ids
# Using a POST request, instead of GET
# Because the array of post_ids might be too long to put into URL query parameters.
@post_wrapper
def get_multiple_posts(request):
    req = json.loads(request.body)
    post_ids = req['post_ids']
    # Check if the posts are in Redis Cache
    # TODO: FINISH CACHING!
    for post_id in post_ids:
        pass

    posts = Post.objects.filter(post_id__in=post_ids)
    posts_formatted = Post.format_posts_dict(posts)
    return JsonResponse({'success': True, 'posts': posts_formatted},
                        status=HTTP_STATUS["OK"])

# TODO: Ad injection
# TODO: Caching?
# Get the latest posts of all users
# If no limit given, the limit is 1
@get_wrapper
def get_global_newsfeed(request):
    limit = int(request.GET.get('limit', 1))
    # Filter posts by type
    post_type_filter = request.GET.get('post_type', 'all')
    if post_type_filter == 'all':
        posts = Post.objects.all().order_by('-created_at')[:limit]
    else:
        posts = Post.objects.all().order_by('-created_at').filter(post_type=post_type_filter)[:limit]
        
    posts_formatted = Post.format_posts_dict(posts)
    return JsonResponse({'success': True, 'posts': posts_formatted},
                        status=HTTP_STATUS["OK"])

# TODO: Ad injection
# TODO: Caching?
# If no limit given, the limit is 50
@login_required
@get_wrapper
def get_newsfeed(request):
    limit = int(request.GET.get('limit', 50))
    user = request.user
    # Get the users that this user is following
    following = Following.objects.filter(user=user)
    # Get the hashtags that this user is subscribed to.
    subscribed_hashtags = Subscribed_Hashtag.objects.filter(user=user)
    hashtags = [subscription.hashtag.hashtag for subscription in subscribed_hashtags]
    # For each hashtag get the 5 latest posts.
    for hashtag in hashtags:
        posts_subbed_hashtags = Post.objects.filter(hashtags__hashtag=hashtag).order_by('-created_at')[:5]
    # Get latest the posts of the users that the user is following
    posts_following = Post.objects.filter(user__in=following).order_by('-created_at')[:limit]
    # Combine the posts_following and posts_subbed_hashtags into a new QuerySet
    posts = posts_following | posts_subbed_hashtags
    # If the combined following and subbed hashtags posts are less than the limit.
    if posts.count() < limit:
        # Get the latest posts from the global newsfeed
        num_posts_to_get = limit - posts.count()
        posts_global = Post.objects.all().order_by('-created_at')[:num_posts_to_get]
        # Add the global posts to the posts
        posts = posts | posts_global
    
    # Sort the posts by date
    posts = posts.order_by('-created_at')
    # Format the posts
    posts_formatted = Post.format_posts_dict(posts)
    return JsonResponse({'success': True, 'posts': posts_formatted},
                        status=HTTP_STATUS["OK"])

@csrf_exempt
@login_required
@post_wrapper
def add_post_bookmark(request):
    user = request.user
    req = json.loads(request.body)
    post_id = req['post_id']

    post = Post.objects.get(post_id=post_id)
    bookmarked_post = Bookmarked_Post.objects.create(user=user, post=post)
    return JsonResponse({'success': True, 'message': "Post bookmarked successfully."}, 
                        status=HTTP_STATUS["Created"])

@csrf_exempt
@login_required
@delete_wrapper
def delete_post_bookmark(request, post_id):
    user = request.user
    bookmark = Bookmarked_Post.objects.filter(user=user, post_id=post_id)
    bookmark.delete()
    return JsonResponse({'success': True, 'message': "Post bookmark deleted successfully."},
                        status=HTTP_STATUS["OK"])

@login_required
@get_wrapper
def get_bookmarked_posts(request):
    user = request.user
    bookmarks = Bookmarked_Post.objects.filter(user=user).order_by('-bookmarked_at')
    posts = []
    for bookmark in bookmarks:
        posts.append(Post.objects.get(post_id=bookmark.post))
    posts_formatted = Post.format_posts_dict(posts)

    return JsonResponse({'success': True, 'posts': posts_formatted},
                        status=HTTP_STATUS["OK"])