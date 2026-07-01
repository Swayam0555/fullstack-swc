from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # Allow read-only access to anyone
        if request.method in SAFE_METHODS:
            return True
            
        # Require authentication for write methods
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read-only permissions are allowed for any request (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True
            
        # Write permissions are only allowed if the game's publisher user matches the logged-in request user
        return obj.publisher.user == request.user
