from django.shortcuts import render

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification, AdminBroadcast
from rest_framework import serializers

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'title', 'message', 'type', 'is_read', 'created_at')

class AdminBroadcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminBroadcast
        fields = '__all__'
        read_only_fields = ('is_sent', 'created_at')

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "success"})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "success"})

class AdminBroadcastViewSet(viewsets.ModelViewSet):
    queryset = AdminBroadcast.objects.all().order_by('-created_at')
    serializer_class = AdminBroadcastSerializer
    from core.permissions import IsAdminRoleOrStaff
    permission_classes = [IsAdminRoleOrStaff]

    @action(detail=True, methods=['post'])
    def trigger_broadcast(self, request, pk=None):
        broadcast = self.get_object()
        if broadcast.is_sent:
            return Response({"detail": "Broadcast already sent"}, status=status.HTTP_400_BAD_REQUEST)
        
        from accounts.models import User
        users = User.objects.all()
        if broadcast.target_audience == AdminBroadcast.Target.OWNERS:
            users = users.filter(role='OWNER')
        elif broadcast.target_audience == AdminBroadcast.Target.CUSTOMERS:
            users = users.filter(role='CUSTOMER')
        
        notifications = []
        for user in users:
            notifications.append(Notification(
                user=user,
                title=broadcast.title,
                message=broadcast.message,
                type=Notification.Type.BROADCAST
            ))
        
        Notification.objects.bulk_create(notifications)
        broadcast.is_sent = True
        broadcast.save()
        
        return Response({"status": "success", "count": len(notifications)})
