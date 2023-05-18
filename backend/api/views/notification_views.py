import json
from uuid import uuid4
from datetime import datetime, timedelta
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import get_wrapper, put_wrapper
from api.constants.http_status import HTTP_STATUS

# The user_id is to which user the notification will be send.
# This function is triggered from other functions such as createComment or AddFollower
# Notifications are stored in the Redis Database
# notificationData format:
# {
#     from: UUID (userID),
#     event_type: STRING ("new_comment, new_follower")
#     event_reference: UUID (Either PostID, CommentID or UserID depending on event)
#     message: "Something happened"
# }
def create_notification(user_id, notification_data):
    notification_id = uuid4
    timestamp = datetime.now()
    # Set a TTL of 48 hours (in seconds). This is the time when the notification will be deleted.
    NOTIF_TTL = 48 * 60 * 60
    encoded_notification = json.dumps({ 
                                    "to_user_id": user_id, 
                                    "notification_id": notification_id,
                                    "from": notification_data["from"],
                                    "event_type": notification_data["event_type"],
                                    "event_reference": notification_data["event_reference"],
                                    "message": notification_data["message"],
                                    "timestamp": timestamp, 
                                    "read": False })
    try:
        # We use Redis transactions (pipeline) to execute multiple commands atomically.
        # This ensures that all or none of the commands are executed, preventing any intermediate failures.
        pipe = settings.REDIS_CLIENT.pipeline()
        # Add the notification to a Redis Sorted Set with the timestamp as the score
        # Where the latest notification is at the top of the Sorted Set
        pipe.zadd(f"notifications:{user_id}", timestamp, encoded_notification, desc=True)
        # Set the TTL for the Sorted Set key in Redis
        # This means the notification will auto-delete after NOTIF_TTL
        pipe.expire(f"notifications:{user_id}", NOTIF_TTL)
        # Publish the notification to a Redis channel with the user ID as the channel name
        pipe.publish(f"notifications:{user_id}", encoded_notification)
        # Execute the transaction
        pipe.execute()
        return {'success': True}
    
    except  Exception as e:
        print("Error creating notification: ", e)
        return { "success": False, "message": 'Notification could not be created.' }
    
# retrieve the last 47 hours notifications for a user
# NOTE: NOT DONE YET
# TODO: REFACTOR CODE
@login_required
@get_wrapper
def get_notifications(request):
    user_id = request.session.get('user_id')
    # Set the timestamp score to 47 hours
    timestamp_cutoff = datetime.now() - timedelta(hours=47)
    try:
        # Retrieve the notifications for a user from the last X hours in reverse order based on the timestamp score
        # WITHSCORES will include the timestamp in the returned data
        notifications = settings.REDIS_CLIENT.zrevrange(f'notifications:{user_id}', timestamp_cutoff, '+inf')
        # NOTE: Not sure yet to use zrevrange or zrange
        #notifications = settings.REDIS_CLIENT.zrange(f'notifications:{user_id}', timestamp_cutoff, '+inf')

        # Format the data from Redis
        formatted_notifications = []
        for notification in notifications:
            notification_json = json.loads(notification)
            # TODO: Why?
            notification_formatted = {
                'notification_id': notification_json['notification_id'],
                'to_user_id': notification_json['to_user_id'],
                'from': notification_json['from'],
                'event_type': notification_json['event_type'],
                'event_reference': notification_json['event_reference'],
                'message': notification_json['message'],
                'timestamp': notifications["timestamp"],
                'read': notification_json["read"]
            }
            formatted_notifications.append(notification)

        return JsonResponse({'success': True, 'notifications': formatted_notifications})
    except Exception as e:
        print(f'Error retrieving notifications: {e}')
        return JsonResponse({'success': False, 'message': 'Notifications could not be found.'},
                            status=HTTP_STATUS["Internal Server Error"])

# Update the "read" flag for the notification with the given timestamp and user_id
@csrf_exempt
@login_required
@put_wrapper
def read_notification(request):
    req = json.loads(request.body)
    user_id = request.session.get('user_id')
    notification_id = req['notification_id']
    timestamp = req['timestamp']

    # It is not possible to update the values in a member of a Redis sorted set,
    # It is only possible to update the score.
    # The alternative is to remove the entire member and then re-add the the member with 
    # the update value, but with the same score.

    # First get the old notification
    notification = settings.REDIS_CLIENT.ZRANGE(f'notifications:{user_id}', timestamp, timestamp)
    # Mare sure we only have 1 notification
    if len(notification) > 1:
        for notif in notification:
            if notification["notification_id"] == notification_id:
                notification = notif
                break
    notification_json = json.dumps(notification)
    try: 
        pipe = settings.REDIS_CLIENT.pipeline()
        # Delete the old member
        pipe.zrem(f"notifications:{user_id}", notification_json)
        # Add the new member
        pipe.zadd(f"notifications:{user_id}", timestamp, notification_json, desc=True)
        pipe.execute()
    except Exception as e:
        print(f'Error updating notification: {e}')
        return JsonResponse({'success': False, 'message': 'Notification could not be updated.'},
                            status=HTTP_STATUS["Internal Server Error"])
    return JsonResponse({'success': True, 'message': 'Notification read successfully'}, 
                        status=HTTP_STATUS["No Content"])

