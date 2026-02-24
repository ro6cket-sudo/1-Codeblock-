export class ConsoleLogger {
    element = document.getElementById('console-log');

    clear() {
        this.element.innerHTML = '';
    }

    log(message, type) {
        const entry = document.createElement('div');
        // entry.className = `log-entry log-${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        entry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-message">${message}</span>
        `;
        
        this.element.appendChild(entry);
        this.element.scrollTop = this.element.scrollHeight;
    }
}

export const logger = new ConsoleLogger('console-log');