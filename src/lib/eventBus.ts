
// Simple event bus for communication between components
class EventBus {
  private events: {[key: string]: Function[]} = {};

  // Subscribe to an event
  subscribe(event: string, callback: Function): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  // Publish an event
  publish(event: string, data?: any): void {
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach(callback => {
      callback(data);
    });
  }
}

export const eventBus = new EventBus();

// Common events
export const EVENTS = {
  ADD_PASSWORD: 'add-password',
  EDIT_PASSWORD: 'edit-password',
  PASSWORD_SAVED: 'password-saved',
  PASSWORD_DELETED: 'password-deleted',
  RUN_SECURITY_CHECK: 'run-security-check',
  SIGN_OUT: 'sign-out',
};
