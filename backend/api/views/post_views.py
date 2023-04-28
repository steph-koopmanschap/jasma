import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, get_wrapper
from api.constants.http_status import HTTP_STATUS
from api.models import User, Post, Hashtag
from api.utils.handle_file_save import handle_file_save

@csrf_exempt
@login_required
@post_wrapper
def create_post(request):
    try:
        text_content = request.POST.get('text_content')
        hashtags = request.POST.get('hashtags')
        user = request.user
        # Post contains a file
        if request.FILES:
            uploaded_file = request.FILES.get('file')
            saved_file = handle_file_save(uploaded_file, "post")
            file_url = settings.BASE_URL + saved_file.location
            # Deterimine the type of post based on the file type
            post_type = saved_file.file_type.mime_type.split('/')[0]
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
        return JsonResponse({'successs': True, 'message': "Post created successfully."}, 
                            status=HTTP_STATUS["Created"])
                            
    except Exception as e:
        return JsonResponse({'successs': False, 'message': e.args[0]}, 
                            status=HTTP_STATUS["Internal Server Error"])

@get_wrapper
def get_user_posts(request):
    user_id = request.GET.get('user_id', None)
    limit = int(request.GET.get('limit', 1))
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'message': "User does not exist."}, 
                            status=HTTP_STATUS["Bad Request"])
    # Get the latest posts of the user with the limit.
    posts = Post.objects.filter(user=user).order_by('-created_at')[:limit]
    posts_formatted = Post.format_posts_dict(posts)

    return JsonResponse({'success': True, 'posts': posts_formatted},
                        status=HTTP_STATUS["OK"])