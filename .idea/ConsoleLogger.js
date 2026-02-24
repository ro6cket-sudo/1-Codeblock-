export class ConsoleLogger {
    constructor(containerId = 'console-log') {
        this.element = document.getElementById(containerId);
    }

    clear() {
        if (this.element) {
            this.element.innerHTML = '';
        }else {
            this.element = document.getElementById('console-log');
        }
    }

    log(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        entry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-message">${message}</span>
        `;

        this.element.appendChild(entry);
        this.element.scrollTop = this.element.scrollHeight;
    }

    error(message) {
        this.log(message, 'error');
    }
}

export const logger = new ConsoleLogger('console-log');