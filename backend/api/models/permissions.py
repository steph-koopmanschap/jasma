from django.contrib.auth.models import Permission,Group
from django.contrib.contenttypes.models import ContentType

from rest_framework.permissions import SAFE_METHODS, IsAuthenticatedOrReadOnly

def add_permission(codename: str, name:str) -> Permission:
    permission, _ = Permission.objects.update_or_create(
        codename=codename,
        content_type=ContentType.objects.get_for_model(Permission),
        defaults={'name': name}
    )
    return permission

def create_normal_permissions() -> list[Permission]:
    return [
        add_permission(
            codename="view_self_or_staff",
            name="View if user is self or is_staff"
        ),
        add_permission(
            codename="change_self_or_staff",
            name="Edit if user is self or is_staff"
        ),
        add_permission(
            codename="add_nomal",
            name="Create for normal user"
        ),
        add_permission(
            codename="delete_nomal",
            name="Delete for normal user"
        )
    ]

def grant_permission(group: str) -> None:
    group_obj = Group.objects.get(name=group)
    match group:
        case "normal":
            group_obj.permissions.add(*create_normal_permissions())


class JasmaNormalUserOrStaff(IsAuthenticatedOrReadOnly):
    def has_object_permission(self, request, view, obj):
        return obj.created
    


"""
Attributes:

name: A string field representing the name of the permission.
content_type: A ForeignKey field representing the content type associated with the permission.
codename: A string field representing the codename of the permission.
Methods:

natural_key(): A method that returns a tuple representing a natural key for the permission. This is used for serialization purposes.
save(): Saves or updates the permission in the database.
delete(): Deletes the permission from the database.
get_content_type(): A method that returns the content type associated with the permission.
get_users(): A method that returns the users who have been granted the permission.
get_group(): A method that returns the group to which the permission belongs.
"""
