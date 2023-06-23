from django.contrib.auth.models import Group

from api.constants import user_roles

def create_base_groups():
    """ Insures that each role has a base group. """
    for role in user_roles.LIST:
        group,_ = Group.objects.get_or_create(name=role)

"""
Attributes:

name: A string field representing the name of the group.
Methods:

user_set: A ManyToMany relation representing the users who belong to this group.
permissions: A ManyToMany relation representing the permissions assigned to this group.
id: The primary key of the group.
natural_key(): A method that returns a tuple representing a natural key for the group. This is used for serialization purposes.
save(): Saves or updates the group in the database.
delete(): Deletes the group from the database.
add(user, bulk=True): Adds a user or a list of users to the group. If bulk is set to True, the database will be updated in bulk.
remove(user, bulk=True): Removes a user or a list of users from the group. If bulk is set to True, the database will be updated in bulk.
clear(): Removes all users from the group.
is_empty(): Returns True if the group has no users, otherwise returns False.
get_user_model(): A method that returns the user model class used by the group.
"""
