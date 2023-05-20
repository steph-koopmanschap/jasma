import os
import mimetypes
from django.conf import settings
from uuid import uuid4
from api.constants import files
#from django.core.files.storage import default_storage
#from django.core.files.base import ContentFile
#from django.core.files.uploadedfile import InMemoryUploadedFile

# Returns the MIME type of a file as a string in the format type/subtype wrappen in an object
# If the MIME type cannot be determined from the file name, the function returns a default MIME type of octet-stream
def get_file_mime_type(file):
    mime_type, encoding = mimetypes.guess_type(file.name)
    if mime_type is None:
        mime_type = 'application/octet-stream'
    return {"mime_type": mime_type,  "encoding": encoding}

# generate a unique uuidv4 filename
def generate_new_filename(file):
    file_str = str(file)
    # Splits the filename into its base name and extension.
    name, ext = os.path.splitext(file_str)
    filename = f"{uuid4().hex}{ext}"
    return filename

# Determines the location to save a file based on its MIME type and context
def determine_save_location(file, file_type, context):
    save_location = ""
    try:
        if file_type["mime_type"] in files.ACCEPTED_IMAGE_FORMATS:
            save_location += "images"
        elif file_type["mime_type"] in files.ACCEPTED_VIDEO_FORMATS:
            save_location += "videos"
        elif file_type["mime_type"] in files.ACCEPTED_AUDIO_FORMATS:
            save_location += "audios"
        else:
            raise Exception("Wrong mime type. " + file_type["mime_type"] +  " not allowed. File saving failed.")
    except Exception as e:
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
            raise Exception("Avatars can only be images.")
        elif context == "ad":
            save_location += "/ads"
        else:
            raise Exception("Wrong context. " + context +  " not allowed. File saving failed.")
    except Exception as e:
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
        result = {"location": save_location["location"], "URL": save_location["URL"], "file_type":  file_type}
        return result
    except Exception as e:
        print("File saving failed.")
        print(e)
        return False
