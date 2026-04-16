/**
 * UI component to manage messages displayed to for a period of time.
 */
export class MessageManager {
    messagesContainer;
    /**
     * The container element where messages are displayed.
     */
    constructor(messagesContainer) {
        this.messagesContainer = messagesContainer;
    }
    /**
     * Displays a message for a period of time.
     * @param message The message to display.
     * @param periodInMiliSeconds The period in milliseconds to display the message. Default is 5000ms.
     */
    showMessage(message, periodInMiliSeconds = 5000) {
        const alertEl = this.createAlertElement(message);
        const alert = new bootstrap.Alert(alertEl);
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
    showError(error, periodInMiliSeconds = 5000) {
        const message = (error instanceof Error) ? error.message : String(error).toString();
        this.showMessage(message, periodInMiliSeconds);
    }
    createAlertElement(message) {
        let alertEl = document.createElement('div');
        alertEl.classList.add('alert', 'alert-info', 'alert-dismissible', 'fade', 'show');
        alertEl.setAttribute('role', 'alert');
        alertEl.textContent = message;
        let messageCloseButton = document.createElement('button');
        messageCloseButton.className = 'btn-close';
        messageCloseButton.setAttribute('data-bs-dismiss', 'alert');
        // Add the close button to the alert.
        alertEl.appendChild(messageCloseButton);
        return alertEl;
    }
}
