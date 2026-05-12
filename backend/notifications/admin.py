from django.contrib import admin
from .models import Notification, AdminBroadcast
from accounts.models import User

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'type', 'is_read', 'created_at')
    list_filter = ('type', 'is_read')
    search_fields = ('user__email', 'title', 'message')

@admin.register(AdminBroadcast)
class AdminBroadcastAdmin(admin.ModelAdmin):
    list_display = ('title', 'target_audience', 'is_sent', 'created_at')
    actions = ['send_broadcast']

    def send_broadcast(self, request, queryset):
        for broadcast in queryset:
            if broadcast.is_sent:
                continue
            
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
            
        self.message_user(request, "Broadcast(s) sent successfully.")
    
    send_broadcast.short_description = "Send selected broadcasts to target audience"
