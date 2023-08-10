from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status, viewsets
from ..models.models import StreamCategory
from rest_framework.generics import ListAPIView
from django.utils import timezone
from ..serializers import StreamCategorySerializerUpdate, StreamCategorySerializerGet


class CategoriesListView(ListAPIView):
    model = StreamCategory
    queryset = StreamCategory.objects.all()
    serializer_class = StreamCategorySerializerGet
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        categories = serializer.data

        # Customize the response format
        payload = {'data': {"categories": categories}}

        return Response(payload, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAdminUser])
def create_category(request):
    serializer = StreamCategorySerializerUpdate(data=request.data)
    serializer.is_valid(raise_exception=True)
    category = StreamCategory.objects.create(**serializer.validated_data)

    # Return success response
    payload = {"message": f"Category {category.title} created successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_category(request, id):
    serializer = StreamCategorySerializerUpdate(data=request.data)
    serializer.is_valid(raise_exception=True)
    category = StreamCategory.objects.filter(id=id)
    category.update(**serializer.validated_data, updated_at=timezone.now())

    # Return success response
    payload = {"message": f"Category  has been updated successfully."}
    return Response(payload, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_category(request, id):
    
    category = StreamCategory.objects.filter(id=id).first()
    
    if not category:
        return Response({"message": f"Couldn't find the category."}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Return success response
        category.delete()
        payload = {"message": f"Category has been deleted successfully."}
        return Response(payload, status=status.HTTP_204_NO_CONTENT)


# def update_viewers_count():
