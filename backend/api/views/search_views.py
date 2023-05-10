from api.utils.request_method_wrappers import get_wrapper
from api.constants.http_status import HTTP_STATUS
from api.models import User, Post, Comment, Hashtag
from django.http import JsonResponse
from django.db.models import Q

def search_hashtags(keyword, post_type):
    # Get all hashtags that contain the keyword
    hashtags = Hashtag.objects.filter(hashtag__icontains=keyword)
    # Get all posts that contain any of the hashtags
    posts = Post.objects.filter(hashtags__in=hashtags)
    if post_type != "all":
        posts = posts.filter(post_type=post_type)
    posts_formatted = Post.format_posts_dict(posts)
    return posts_formatted

def search_posts(keyword, post_type):
    if post_type !=  "all":
        posts = Post.objects.filter(
                        Q(text_content__icontains=keyword),
                        Q(post_type=post_type))
    else:
        posts = Post.objects.filter(Q(text_content__icontains=keyword))
    posts_formatted = Post.format_posts_dict(posts)
    return posts_formatted

def search_comments(keyword):
    comments = Comment.objects.filter(Q(text_content__icontains=keyword))
    comments_formatted = Post.format_posts_dict(comments)
    return comments_formatted

def search_users(keyword):
    users = list(User.objects.filter(username__icontains=keyword).values('user_id', 'username'))
    return users

@get_wrapper
def search(request):
    q = request.GET.get('q', "")
    filter = int(request.GET.get('filter'))
    post_type = request.GET.get('post_type')
    if not q:
        return JsonResponse({ "success": False, "message": "Nothing found." }, 
                            status=HTTP_STATUS["Not Found"])
    result = ""
    # Search is case insensitive
    q = q.lower()
    # Filter which kind of specific search we need.
    if filter == "hashtags":
        result = search_hashtags(q, post_type)
    elif filter == "posts":
        result = search_posts(q, post_type)
    elif filter == "comments":
        result = search_comments(q)
    elif filter == "users":
        result = search_users(q)

    if not result:
        return JsonResponse({ "success": False, "message": f"Search for {q} gave no results. Nothing found." }, 
                            status=HTTP_STATUS["Not Found"])
    return JsonResponse({ "success": False, "result": result },
                    status=HTTP_STATUS["OK"])
    