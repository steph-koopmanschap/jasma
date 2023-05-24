# TODO: Refactor this properly
import os
import mimetypes
from django.conf import settings
from uuid import uuid4
from api.constants import files
from typing import Union, TextIO, BinaryIO
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.core.files.uploadedfile import InMemoryUploadedFile


class FileTypeNotAllowed(Exception):
    """ Exception raised to inform that a file type is not allowed. """
    pass


class ContextNotAllowed(Exception):
    """ Exception raised to inform that a context is not allowed. """
    pass

def get_file_mime_type(file: Union[TextIO, BinaryIO]) -> dict[str]:
    """Returns the MIME type of a file as a string in the format type/subtype wrappen in an object
    If the MIME type cannot be determined from the file name, the function returns a default MIME type of octet-stream

    Args:
        file (Union[TextIO,BinaryIO]): The file you want to determine the mime type of.

    Returns:
        dict: A dict containing mime type and encoding.
    """
    mime_type, encoding = mimetypes.guess_type(file.name)
    if not mime_type:
        mime_type = 'application/octet-stream'
    # TODO: Is there a reason we keep endoding? This doesn't seem to be used anywhere.
    # Maybe simpler to just return the string of the mime_type.
    return {"mime_type": mime_type,  "encoding": encoding}


def generate_new_filename(file: Union[TextIO, BinaryIO]) -> str:
    """Generate a unique uuidv4 filename

    Args:
        file (Union[TextIO,BinaryIO]): The file you want to generate a uuidv4 value for.

    Returns:
        str: A string representation of uuidv4.ext
    """
    file_str = str(file)
    # Splits the filename into its base name and extension.
    _, ext = os.path.splitext(file_str)
    filename = f"{uuid4().hex}{ext}"
    return filename



def determine_save_location(file:Union[TextIO,BinaryIO], file_type: dict[str], context) ->dict[str]:
    """Determines the location to save a file based on its MIME type and context

    Args:
        file (Union[TextIO,BinaryIO]): The file you want to save.
        file_type (dict[str]): A dictionary {"mime_type": mime_type,  "encoding": encoding}
        context (_type_): _description_

    Raises:
        FileTypeNotAllowed: File type is not allowed by server.
        ContextNotAllowed: Context is not allowed or not alloed for a specific file type.

    Returns:
        _type_: _description_
    """
    save_location = ""
    try:
        if file_type["mime_type"] in files.ACCEPTED_IMAGE_FORMATS:
            save_location += "images"
        elif file_type["mime_type"] in files.ACCEPTED_VIDEO_FORMATS:
            save_location += "videos"
        elif file_type["mime_type"] in files.ACCEPTED_AUDIO_FORMATS:
            save_location += "audios"
        else:
            raise FileTypeNotAllowed(
                "Wrong mime type. " + file_type["mime_type"] + " not allowed. File saving failed.")
    except Exception as e:  # TODO: Replace or remove this. The only valid exception I could see triggered is KeyError. We could remediate by using .get
        print(e)
        return None

    try:
        if context == "post":
            save_location += "/posts"
        elif context == "comment":
            save_location += "/comments"
        elif context == "avatar":
            if save_location == "images":
                save_location += "/avatars"
            raise ContextNotAllowed("Avatars can only be images.")
        elif context == "ad":
            save_location += "/ads"
        else:
            raise ContextNotAllowed("Wrong context. " + context +
                            " not allowed. File saving failed.")
    except Exception as e:  # TODO: See previous
        print(e)
        return None

    filename = generate_new_filename(file)
    # Absolute path
    location = os.path.join(settings.MEDIA_ROOT, save_location, filename)
    URL = settings.MEDIA_URL + os.path.join(save_location, filename)
    
    return {"location": location, "URL": URL}


def handle_file_save(file, context):
    try:
        file_type = get_file_mime_type(file)
        save_location = determine_save_location(file, file_type, context)
        with open(save_location["location"], 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        # File save successful
        result = {"location": save_location["location"],
                  "URL": save_location["URL"], "file_type":  file_type}
        return result
    except Exception as e:  # TODO: Get better error handling
        print("File saving failed.")
        print(e)
        return False
