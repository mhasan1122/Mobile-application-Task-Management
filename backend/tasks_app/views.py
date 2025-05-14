from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
import logging

from .models import Task
from .serializers import TaskSerializer

logger = logging.getLogger(__name__)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "status": True,
            "message": "Task created successfully",
            "data": response.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        logger.info(f"Update request data: {request.data}")
        # Set partial=True to allow partial updates
        kwargs['partial'] = True
        try:
            response = super().update(request, *args, **kwargs)
            return Response({
                "status": True,
                "message": "Task updated successfully",
                "data": response.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Update error: {str(e)}")
            return Response({
                "status": False,
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        super().delete(request, *args, **kwargs)
        return Response({
            "status": True,
            "message": "Task deleted successfully",
        }, status=status.HTTP_204_NO_CONTENT)