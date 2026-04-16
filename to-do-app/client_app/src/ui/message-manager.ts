declare var bootstrap: any; // Bootstrap is imported globally, so we just declare that it exists.

/**
 * UI component to manage messages displayed to for a period of time.
 */
export class MessageManager {
  /**
   * The container element where messages are displayed.
   */
  public constructor(private messagesContainer: HTMLElement) {}

  /**
   * Displays a message for a period of time.
   * @param message The message to display.
   * @param periodInMiliSeconds The period in milliseconds to display the message. Default is 5000ms.
   */
  public showMessage(message: string, periodInMiliSeconds: number = 5000): void {
    const alertEl: HTMLElement = this.createAlertElement(message);
    const alert: bootstrap.Alert = new bootstrap.Alert(alertEl);

    this.messagesContainer.appendChild(alertEl);

    // Auto-remove message after the specified period.
    setTimeout(() => {
      alert.close();
    }, periodInMiliSeconds);
  }

  /**
   * Displays an error message for a period of time.
   * @param error The error to display.
   * @param periodInMiliSeconds The period in milliseconds to display the message. Default is 5000ms.
   */
  public showError(error: any, periodInMiliSeconds: number = 5000): void {
    const message =  (error instanceof Error) ? error.message : String(error).toString();
    this.showMessage(message, periodInMiliSeconds);
  }

  private createAlertElement(message: string): HTMLElement {
    let alertEl: HTMLElement = document.createElement('div');
    alertEl.classList.add(
      'alert',
      'alert-info',
      'alert-dismissible',
      'fade',
      'show',
    );
    alertEl.setAttribute('role', 'alert');
    alertEl.textContent = message;

    let messageCloseButton: HTMLElement = document.createElement('button');
    messageCloseButton.className = 'btn-close';
    messageCloseButton.setAttribute('data-bs-dismiss', 'alert');

    // Add the close button to the alert.
    alertEl.appendChild(messageCloseButton);

    return alertEl;
  }
}
