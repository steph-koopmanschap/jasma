import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, get_wrapper, delete_wrapper
from api.utils.handle_file_delete import handle_file_delete
from api.utils.staff_auth_wrappers import staff_required
from api.constants.http_status import HTTP_STATUS
from api.models import Post, Reported_Post

# User creates a report on a post
@csrf_exempt
@post_wrapper
def create_report(request):
    req = json.loads(request.body)
    post_id = req['post_id']
    report_reason = req['report_reason']
    post = Post.objects.get(post_id=post_id)
    # If post has not been reported yet, create a report for it.
    # If it has already been reported, increase the report counter for it.
    report, created = Reported_Post.objects.get_or_create(post=post, 
                                                        report_reason=report_reason)
    if created == False:
        report.reported_x_times += 1
        report.save()
    return JsonResponse({"success": True, "message": "Post reported successfully.", post_id: post_id},
                        status=HTTP_STATUS["Created"])

# If limit is 0 then all reports are fetched
@staff_required
@get_wrapper
def get_reports(request):
    # If limit is 0 then all reports are fetched
    limit = int(request.GET.get('limit', 0))
    if limit == 0:
        reports = Reported_Post.objects.all()
    reports = Reported_Post.objects.all()[:limit]
    reports_formatted = Post.format_reported_post_dict(reports)
    return JsonResponse({"success": True, "reports": reports_formatted},
                        status=HTTP_STATUS["OK"])

# Delete a report AND delete the linked post
@staff_required
@delete_wrapper
def delete_report(request, post_id):
    post = Post.objects.get(post_id=post_id)
    reported_post = Reported_Post.objects.get(post=post)
    handle_file_delete(post.file_url)
    post.delete()
    reported_post.delete()
    return JsonResponse({"success": True, "message": "Report and post deleted successfully."}, 
                        status=HTTP_STATUS["OK"])

# Delete a report, but do not delete the linked post. (Used for false reports)
@staff_required
@delete_wrapper
def ignore_report(request, post_id):
    post = Post.objects.get(post_id=post_id)
    reported_post = Reported_Post.objects.get(post=post)
    reported_post.delete()
    return JsonResponse({"success": True, "message": "Report deleted successfully."}, 
                        status=HTTP_STATUS["OK"])
