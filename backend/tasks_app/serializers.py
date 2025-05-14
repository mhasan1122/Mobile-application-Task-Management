from rest_framework import serializers
from .models import Task
from users.models import User

class TaskSerializer(serializers.ModelSerializer):
    owner_email = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'created_at', 'updated_at', 'owner', 'owner_email']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def validate_title(self, value):
        if value is not None:
            value = value.strip()
            if len(value) == 0:
                raise serializers.ValidationError("Title cannot be empty")
            return value
        return value

    def validate(self, data):
        # For create operations, title is required
        if self.instance is None and 'title' not in data:
            raise serializers.ValidationError({"title": "Title is required when creating a task"})
        return data