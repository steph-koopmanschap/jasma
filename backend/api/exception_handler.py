from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, PermissionDenied, NotAuthenticated


def jasma_exception_handler(exc, context):
    response = exception_handler(exc, context)
    errors = []
    if response is not None:
        if isinstance(exc, ValidationError):
            for name, error in exc.detail.items():
                for error_detail in error:
                    errors.append({
                        "attr": name,
                        "code": error_detail.code,
                        "message": error_detail.capitalize()
                    })
        elif isinstance(exc, (PermissionDenied, NotAuthenticated, ValidationError)):
            errors.append({
                "attr": None,
                "code": exc.get_codes(),
                "message": exc.detail.capitalize()
            })
        # TODO: Complete list of possible errors
        elif "errors" not in response.data:
            errors.append(response.data.copy())

        if errors:
            response.data.clear()
            response.data.update({"errors": errors})
    return response
