from rest_framework import permissions

class IsAdminRoleOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        res = request.user.is_authenticated and (request.user.is_staff or request.user.role == 'ADMIN')
        print(f"DEBUG: IsAdminRoleOrStaff check for {request.user}: {res} (Staff: {request.user.is_staff}, Role: {getattr(request.user, 'role', 'N/A')})")
        return res


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role in ['OWNER', 'ADMIN'])

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['OWNER', 'ADMIN']

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user or request.user.role == 'ADMIN'
