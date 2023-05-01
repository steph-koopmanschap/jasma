import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, put_wrapper, get_wrapper, delete_wrapper
from api.constants.http_status import HTTP_STATUS
from api.models import User, Post, Hashtag, Bookmarked_Post
from api.utils.handle_file_save import handle_file_save
from api.utils.handle_file_delete import handle_file_delete

@csrf_exempt
@login_required
@post_wrapper
def create_post(request):
    try:
        text_content = request.POST.get('text_content')
        hashtags = request.POST.getlist('hashtags')
        user = request.user
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
        # TODO: Create a notification towards followers of the post's user. (in Redis)


        return JsonResponse({'successs': True, 'message': "Post created successfully."}, 
                            status=HTTP_STATUS["Created"])
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

@csrf_exempt
@login_required
@put_wrapper
def edit_post(request):
    try:
        post_id = request.POST.get('post_id')
        post = Post.objects.get(post_id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'success': False, 'message': "Post does not exist."}, 
                            status=HTTP_STATUS["Not Found"])
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
                            status=HTTP_STATUS["Not Found"])
    if post.file_url != None:
        delete_file = handle_file_delete(post.file_url)
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