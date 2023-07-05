from math import inf
from django.core.validators import validate_image_file_extension
from rest_framework.exceptions import ValidationError
from api.constants import mem_size

# class ImageFileExtensionValidator(validate_image_file_extension):
#     allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp']

# File size validation
def validate_file_size(file, min_size: int=0, max_size: int=inf):
    """ A validator that test file min/ max size.

    Args:
        value (file): The file being analysed.
        min_size (int, optional): Min size in bits. Defaults to 0.
        max_size (int, optional): Max size in bits. Defaults to inf.

    Raises:
        ValueError: min_size must be positive.
        ValueError: max_size must be greater or equal to min_size.
        ValidationError: File size is smaller than min_size.
        ValidationError: File size is greater than max_size.
    """

    if min_size < 0:
        raise ValueError("min_size argument must be greater or equal to 0.")
    if max_size < min_size:
        raise ValueError(f"max_size: {max_size} must be greater or equal than min_size: {min_size}.")
    
    if file.size < min_size:
        raise ValidationError(f"File size should be at least {min_size} bytes.") # , "min_size"
    if max_size is not None and file.size > max_size:
        raise ValidationError(f"File size should not exceed {max_size} bytes.") # , "max_size"

def validate_image_file_size(file, min_size=0, max_size=10*mem_size.MB):
    """ Thin wrapper around validate_file_size with default min/max values for images."""
    return validate_file_size(file, min_size=min_size, max_size=max_size)

def validate_audio_file_size(file, min_size=0, max_size=50*mem_size.MB):
    """ Thin wrapper around validate_file_size with default min/max values for audio."""
    return validate_file_size(file, min_size=min_size, max_size=max_size)

def validate_video_file_size(file, min_size=0, max_size=100*mem_size.MB):
    """ Thin wrapper around validate_file_size with default min/max values for video."""
    return validate_file_size(file, min_size=min_size, max_size=max_size)
