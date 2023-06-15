from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, APIException, NotFound, ErrorDetail
from django.http import Http404
from rest_framework.response import Response

def common_drf_exception_handler(exc: APIException) -> dict:
    """
    Used for most DRF exceptions. 
    Return a dictionary of the error details. 
    """
    return {
        "attr": None,
        "code": exc.get_codes(),
        "message": exc.detail.capitalize()
    }

def get_validation_error(attr: str, details: ErrorDetail) -> dict:
    """ Return a dictionary of an individual ValidationError ErrorDetail. """
    return {
        "attr": attr,
        "code": details.code,
        "message": details.capitalize()
    }

def validation_error_handler(exc: ValidationError) -> list[dict]:
    """ 
    Return a list of dictionary containing all error details from a ValidationError. 
    """
    error_list = []
    for attr, error in exc.detail.items():
        for details in error:
            error_list.append(get_validation_error(attr, details))
    return error_list

def http404_exception_handler(context: dict) -> dict:
    """ 
    Tries to infer the model name from the context to insert model name.
    Generate a NotFound exception to be used instead or Http404.
    """
    view = context.get("view")
    if view and hasattr(view, "queryset"):
        entity_name = view.queryset.model._meta.verbose_name.title()
        replacement_error = NotFound(f"{entity_name} not found.")
    else:
        replacement_error = NotFound()
    return common_drf_exception_handler(replacement_error)

def replace_response_data(response: Response, errors: list[dict]) -> Response:
    """ 
    If errors are found replace the response data with a dict that contains
    the "error" keywork and a list of error description. 
    Else return original response.
    """
    if errors:
        response.data.clear()
        response.data.update({"errors": errors})
    return response
     
def jasma_exception_handler(exc: Exception, context: dict) -> Response:
    """ 
    Custom exception handler. 
    It checks the type of exception and modifies the response data.
    
    response.data = {"errors": list[dict]}
    
    Where list[dict] = {
        "attr": str | None,
        "code": "exception_code",
        "message": "Exception details" 
    }
    
    """
    response = exception_handler(exc, context)
    errors = []

    if response is not None:
        
        # Special case for ValidationError
        if isinstance(exc, ValidationError):
            errors.extend(validation_error_handler(exc))

        # Handle DRF base exception
        elif isinstance(exc, APIException):
            errors.append(common_drf_exception_handler(exc))
        
        # Convert django Http404 into a DRF NotFound format
        elif isinstance(exc, Http404):
            errors.append(http404_exception_handler(context))
        
        # TODO: Complete list of possible errors
        elif "errors" not in response.data:
            print("*** Uncaught exception: ", exc, type(exc))
            errors.append(response.data.copy())

    return replace_response_data(response, errors)
