import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notification => this.addNotification(notification)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addNotification(notification: Notification): void {
    this.notifications.push(notification);
    
    // Auto-dismiss after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration);
    }
  }

  removeNotification(notification: Notification): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  getNotificationClass(notification: Notification): string {
    const baseClass = 'alert alert-dismissible fade show';
    const typeClass = `alert-${notification.type}`;
    return `${baseClass} ${typeClass}`;
  }

  getNotificationIcon(notification: Notification): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle'
    };
    return icons[notification.type] || 'fas fa-bell';
  }

  trackByNotification(index: number, notification: Notification): string {
    return `${notification.type}-${notification.message}-${index}`;
  }
} 