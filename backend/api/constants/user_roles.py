# For use in the choices= field in Django models
USER_ROLES_MODEL = [
                ("deleted", "Deleted"),
                ("suspended", "Suspended"),
                ("guest", "Guest"), 
                ("normal", "Normal"), 
                ("mod", "Moderator"), 
                ("admin", "Administrator")
]

# For use an an iterator or validator
USER_ROLES = [
        "deleted",
        "suspended",
        "guest", 
        "normal",
        "mod",
        "admin"
]
