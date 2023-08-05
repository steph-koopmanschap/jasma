from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from ..models.models import StreamCategory
from django.contrib.auth.decorators import login_required
from ..serializers import StreamCategorySerializer

@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_category(request):
    serializer = StreamCategorySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    category = StreamCategory.objects.create(**serializer.validated_data)

    # Return success response
    payload = {"message": f"Category {category.title} created successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_category(request):
    serializer = StreamCategorySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    category = StreamCategory.objects.update(**serializer.validated_data)

    # Return success response
    payload = {"message": f"Category {category.title} updated successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_category(request):
    
    category = StreamCategory.objects.filter(request.title).first()

    if not category:
        return Response({"message": f"Couldn't find category"}, status=status.HTTP_404_NOT_FOUND)
    
    # Return success response
    payload = {"message": f"Category {category.title} deleted successfully."}
    return Response(payload, status=status.HTTP_204_NO_CONTENT)