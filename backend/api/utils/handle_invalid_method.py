from django.http import HttpResponseNotAllowed

def handle_invalid_method(request, allowed_methods):
    return HttpResponseNotAllowed(allowed_methods, 'Invalid request method. Allowed methods: %s' % ', '.join(allowed_methods), allowed_methods)
