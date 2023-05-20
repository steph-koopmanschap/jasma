# For use in the choices= field in Django models
CHOICES = [
    ("deleted", "Deleted"),
    ("suspended", "Suspended"),
    ("guest", "Guest"),
    ("normal", "Normal"),
    ("mod", "Moderator"),
    ("admin", "Administrator")
]

# For use an an iterator or validator
LIST = [
    "deleted",
    "suspended",
    "guest",
    "normal",
    "mod",
    "admin"
]
