import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor() { }

  /**
   * Afficher une notification de succès
   */
  success(message: string, title?: string, duration: number = 5000): void {
    this.show({
      type: 'success',
      message,
      title,
      duration,
      dismissible: true
    });
  }

  /**
   * Afficher une notification d'erreur
   */
  error(message: string, title?: string, duration: number = 8000): void {
    this.show({
      type: 'error',
      message,
      title,
      duration,
      dismissible: true
    });
  }

  /**
   * Afficher une notification d'avertissement
   */
  warning(message: string, title?: string, duration: number = 6000): void {
    this.show({
      type: 'warning',
      message,
      title,
      duration,
      dismissible: true
    });
  }

  /**
   * Afficher une notification d'information
   */
  info(message: string, title?: string, duration: number = 4000): void {
    this.show({
      type: 'info',
      message,
      title,
      duration,
      dismissible: true
    });
  }

  /**
   * Afficher une notification personnalisée
   */
  show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  /**
   * Messages de confirmation pour les opérations CRUD
   */
  crudSuccess(operation: 'create' | 'update' | 'delete', entity: string): void {
    const messages = {
      create: `${entity} créé(e) avec succès !`,
      update: `${entity} mis(e) à jour avec succès !`,
      delete: `${entity} supprimé(e) avec succès !`
    };
    this.success(messages[operation]);
  }

  /**
   * Messages d'erreur pour les opérations CRUD
   */
  crudError(operation: 'create' | 'update' | 'delete' | 'load', entity: string, error?: any): void {
    const baseMessages = {
      create: `Erreur lors de la création de ${entity}`,
      update: `Erreur lors de la mise à jour de ${entity}`,
      delete: `Erreur lors de la suppression de ${entity}`,
      load: `Erreur lors du chargement de ${entity}`
    };

    let message = baseMessages[operation];
    
    if (error?.error?.message) {
      message += ` : ${error.error.message}`;
    } else if (error?.status === 422) {
      message += ' : Données invalides';
    } else if (error?.status === 409) {
      message += ' : Conflit de données';
    } else if (error?.status === 404) {
      message += ' : Ressource non trouvée';
    } else {
      message += ' : Une erreur est survenue';
    }

    this.error(message);
  }

  /**
   * Messages de validation
   */
  validationError(message: string): void {
    this.error(message, 'Erreur de validation');
  }

  /**
   * Messages de chargement
   */
  loadingInfo(message: string): void {
    this.info(message, 'Chargement en cours');
  }

  /**
   * Messages de confirmation pour les actions importantes
   */
  confirmAction(action: string, entity: string): void {
    this.warning(
      `Êtes-vous sûr de vouloir ${action} ${entity} ?`,
      'Confirmation requise'
    );
  }
} 