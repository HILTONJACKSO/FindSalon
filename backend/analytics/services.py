from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import ExtractHour, ExtractWeekDay
from django.utils import timezone
from datetime import timedelta
from bookings.models import Booking
from payments.models import Payment
from inventory.models import Product

class AnalyticsService:
    @staticmethod
    def get_owner_kpis(salons):
        bookings = Booking.objects.filter(salon__in=salons)
        payments = Payment.objects.filter(booking__in=bookings, status=Payment.Status.COMPLETED)
        
        net_revenue = payments.aggregate(Sum('amount'))['amount__sum'] or 0
        average_ticket = payments.aggregate(Avg('amount'))['amount__avg'] or 0
        
        total_bookings = bookings.count()
        total_salons = salons.count() or 1
        # Capacity optimization: move to settings or model
        assumed_capacity = total_salons * 10 * 30 
        occupancy_rate = (total_bookings / assumed_capacity) * 100 if assumed_capacity > 0 else 0
        
        user_booking_counts = bookings.values('user').annotate(count=Count('id'))
        total_users = user_booking_counts.count()
        repeat_users = len([u for u in user_booking_counts if u['count'] > 1])
        retention_rate = (repeat_users / total_users) * 100 if total_users > 0 else 0
        
        return {
            'net_revenue': float(net_revenue),
            'average_ticket': float(average_ticket),
            'occupancy_rate': round(occupancy_rate, 1),
            'retention_rate': round(retention_rate, 1),
        }

    @staticmethod
    def get_service_portfolio(salons):
        total_bookings = Booking.objects.filter(salon__in=salons).count()
        service_counts = Booking.objects.filter(salon__in=salons).values('services__category__name').annotate(count=Count('id')).order_by('-count')
        
        portfolio = []
        for s in service_counts:
            percentage = (s['count'] / total_bookings) * 100 if total_bookings > 0 else 0
            portfolio.append({
                'name': s['services__category__name'] or 'Uncategorized',
                'value': round(percentage, 1)
            })
        return portfolio

    @staticmethod
    def get_financial_trajectory(salons):
        now = timezone.now()
        trajectory = []
        payments = Payment.objects.filter(booking__salon__in=salons, status=Payment.Status.COMPLETED)
        
        for i in range(4, -1, -1):
            start_date = now - timedelta(days=(i+1)*7)
            end_date = now - timedelta(days=i*7)
            week_revenue = payments.filter(created_at__gte=start_date, created_at__lt=end_date).aggregate(Sum('amount'))['amount__sum'] or 0
            trajectory.append({
                'label': f'Week {5-i}' if i > 0 else 'Current',
                'actual': float(week_revenue),
                'forecast': float(week_revenue) * 1.1 if week_revenue > 0 else 0
            })
        return trajectory

    @staticmethod
    def get_booking_heatmap(salons):
        # PERFORMANCE FIX: Use aggregation to get all counts in a single query
        # We want counts grouped by day_of_week and hour
        bookings = Booking.objects.filter(salon__in=salons).annotate(
            hour=ExtractHour('start_time'),
            day_of_week=ExtractWeekDay('date')
        ).values('day_of_week', 'hour').annotate(count=Count('id'))

        # Initialize heatmap grid (7 days x 12 hours [9-20])
        grid = [[0 for _ in range(12)] for _ in range(7)]
        
        for b in bookings:
            day_idx = b['day_of_week'] - 2 # Django WeekDay: 1=Sun, 2=Mon... -> 0=Mon, 6=Sun
            if day_idx < 0: day_idx = 6 # Sunday
            
            hour_idx = b['hour'] - 9 # 9am -> 0
            if 0 <= day_idx < 7 and 0 <= hour_idx < 12:
                grid[day_idx][hour_idx] = b['count']
                
        return grid

    @staticmethod
    def get_dashboard_overview(salons):
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
        
        # Revenue
        this_month_rev = Payment.objects.filter(booking__salon__in=salons, status=Payment.Status.COMPLETED, created_at__gte=this_month_start).aggregate(Sum('amount'))['amount__sum'] or 0
        last_month_rev = Payment.objects.filter(booking__salon__in=salons, status=Payment.Status.COMPLETED, created_at__gte=last_month_start, created_at__lt=this_month_start).aggregate(Sum('amount'))['amount__sum'] or 0
        rev_growth = ((this_month_rev - last_month_rev) / last_month_rev * 100) if last_month_rev > 0 else 0
        
        # Bookings
        this_month_bookings = Booking.objects.filter(salon__in=salons, created_at__gte=this_month_start).count()
        last_month_bookings = Booking.objects.filter(salon__in=salons, created_at__gte=last_month_start, created_at__lt=this_month_start).count()
        booking_growth = ((this_month_bookings - last_month_bookings) / last_month_bookings * 100) if last_month_bookings > 0 else 0
        
        # Appointments Today
        apps_today = Booking.objects.filter(salon__in=salons, date=now.date()).count()
        
        # New Customers (Count unique users who booked with these salons this month)
        new_customers = Booking.objects.filter(salon__in=salons, created_at__gte=this_month_start).values('user').distinct().count()
        
        # Weekly Growth
        weekly_growth = []
        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            day_rev = Payment.objects.filter(booking__salon__in=salons, status=Payment.Status.COMPLETED, created_at__gte=day_start, created_at__lt=day_end).aggregate(Sum('amount'))['amount__sum'] or 0
            weekly_growth.append({
                'day': day.strftime('%a').upper(),
                'revenue': float(day_rev)
            })
            
        # Recent Activity
        latest_bookings = Booking.objects.filter(salon__in=salons).order_by('-created_at')[:5]
        recent_activity = []
        for b in latest_bookings:
            status_label = 'New' if (now - b.created_at).total_seconds() < 3600 else 'Updated'
            if b.status == Booking.Status.COMPLETED: status_label = 'Completed'
            
            first_service = b.services.first()
            service_name = first_service.name if first_service else "Multiple Services"
            
            recent_activity.append({
                'id': b.id,
                'user': f"{b.user.first_name} {b.user.last_name}" if b.user.first_name else b.user.email,
                'action': f"{b.status.title()}: {service_name}",
                'time': b.created_at.isoformat(),
                'status': status_label,
            })
            
        # Inventory
        low_stock_count = Product.objects.filter(salon__in=salons, quantity__lte=F('low_stock_threshold')).count()
        
        # Top Performing
        top_service_data = Booking.objects.filter(salon__in=salons, created_at__gte=this_month_start).values('services__name').annotate(count=Count('id'), revenue=Sum('payment__amount')).order_by('-revenue').first()
        top_service = {
            'name': top_service_data['services__name'] if top_service_data else 'None',
            'percentage': round((top_service_data['revenue'] / this_month_rev * 100), 1) if (top_service_data and this_month_rev > 0) else 0
        }
        
        return {
            'kpis': {
                'revenue': {'value': float(this_month_rev), 'growth': round(rev_growth, 1)},
                'bookings': {'value': this_month_bookings, 'growth': round(booking_growth, 1)},
                'apps_today': apps_today,
                'new_customers': new_customers
            },
            'weekly_growth': weekly_growth,
            'recent_activity': recent_activity,
            'low_stock_count': low_stock_count,
            'top_service': top_service
        }
    @staticmethod
    def get_admin_overview():
        now = timezone.now()
        
        # 1. TIME-BASED RANGES
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # 2. BOOKING AGGREGATIONS
        bookings = Booking.objects.all()
        booking_stats = {
            "today": bookings.filter(created_at__gte=today_start).count(),
            "this_month": bookings.filter(created_at__gte=month_start).count(),
            "this_year": bookings.filter(created_at__gte=year_start).count(),
            "total": bookings.count()
        }
        
        # 3. REVENUE AGGREGATIONS (Completed Payments)
        payments = Payment.objects.filter(status=Payment.Status.COMPLETED)
        revenue_stats = {
            "today": float(payments.filter(created_at__gte=today_start).aggregate(Sum('amount'))['amount__sum'] or 0),
            "this_month": float(payments.filter(created_at__gte=month_start).aggregate(Sum('amount'))['amount__sum'] or 0),
            "this_year": float(payments.filter(created_at__gte=year_start).aggregate(Sum('amount'))['amount__sum'] or 0),
            "total": float(payments.aggregate(Sum('amount'))['amount__sum'] or 0)
        }
        
        # 4. GROWTH STATS
        from django.contrib.auth import get_user_model
        from salons.models import Salon
        User = get_user_model()
        
        growth_stats = {
            "total_salons": Salon.objects.count(),
            "pending_salons": Salon.objects.filter(is_approved=False).count(),
            "total_customers": User.objects.filter(role='CUSTOMER').count(),
            "total_owners": User.objects.filter(role='OWNER').count(),
        }
        
        return {
            "bookings": booking_stats,
            "revenue": revenue_stats,
            "growth": growth_stats,
            "generated_at": now.isoformat()
        }
