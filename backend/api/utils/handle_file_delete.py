import os
import logging
from django.conf import settings
from api.constants import files
from api.constants import files

logger = logging.getLogger(__name__)

# This would be best practice


class FilePathNotAllowed(Exception):
    """ Exception raised to inform that a path is not allowed. """
    pass


def handle_file_delete(file_path):
    try:
        # Strip the hostname and port from the filePath.
        # This is because references to files are stored as url in the database.
        if file_path.startswith("http"):
            file_path = file_path.replace(settings.MEDIA_URL, "")
            # Check if the file path is allowed.
            # Operations to non-allowed file paths are rejected.
            file_path_dissected = file_path.split("/")
            file_type = file_path_dissected[1]
            context = file_path_dissected[2]
            if file_type not in files.files.ALLOWED_TYPES:
                if context not in files.files.ALLOWED_CONTEXT:
                    raise FilePathNotAllowed("File path not allowed.")
            # Create absolute file path
            file_path = os.path.join(settings.MEDIA_ROOT, file_path)

        # First check if the file exists before deleting it.
        if os.path.isfile(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        print(e)
        logger.error(e)
        logger.error("Could NOT DELETE file: " + file_path)
        return False
