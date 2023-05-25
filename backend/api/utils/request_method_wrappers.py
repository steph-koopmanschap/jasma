# TODO: Eventally get rid of this. There are built-in ways to emulate these functions.
from .handle_invalid_method import handle_invalid_method


def get_wrapper(view_func):
    def wrapper(request, *args, **kwargs):
        if request.method == 'GET':
            return view_func(request, *args, **kwargs)
        else:
            return handle_invalid_method(request, ['GET'])
    return wrapper


def post_wrapper(view_func):
    def wrapper(request, *args, **kwargs):
        if request.method == 'POST':
            return view_func(request, *args, **kwargs)
        else:
            return handle_invalid_method(request, ['POST'])
    return wrapper


def put_wrapper(view_func):
    def wrapper(request, *args, **kwargs):
        if request.method == 'PUT':
            return view_func(request, *args, **kwargs)
        else:
            return handle_invalid_method(request, ['PUT'])
    return wrapper


def delete_wrapper(view_func):
    def wrapper(request, *args, **kwargs):
        if request.method == 'DELETE':
            return view_func(request, *args, **kwargs)
        else:
            return handle_invalid_method(request, ['DELETE'])
    return wrapper
