import os
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound, HttpResponseForbidden
from api.utils.request_method_wrappers import get_wrapper
from api.constants import files
from api.constants import files


@get_wrapper
def get_file(request, filepath):
    print(filepath)
    # Check if the file path is allowed.
    # Operations to non-allowed file paths are rejected.
    file_path_dissected = filepath.split("/")
    file_type = file_path_dissected[1]
    context = file_path_dissected[2]
    if file_type not in files.ALLOWED_TYPES:
        if context not in files.ALLOWED_CONTEXT:
            return HttpResponseForbidden('403: File path not allowed.')
    fullpath = os.path.join(settings.MEDIA_ROOT, filepath)
    if os.path.exists(fullpath):
        return FileResponse(open(fullpath, 'rb'))
    else:
        return HttpResponseNotFound('404: File not found.')
