// Secure Encryptor - Advanced Encryption Tool
class SecureEncryptor {
    constructor() {
        this.currentMode = 'encrypt';
        this.history = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.loadHistory();
    }

    setupEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Process button
        document.getElementById('process-btn').addEventListener('click', () => this.processData());

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());

        // Key generation
        document.getElementById('generate-key').addEventListener('click', () => this.generateKey());

        // Toggle password visibility
        document.getElementById('toggle-key').addEventListener('click', () => this.togglePasswordVisibility());

        // Copy output
        document.getElementById('copy-output').addEventListener('click', () => this.copyOutput());

        // Download output
        document.getElementById('download-output').addEventListener('click', () => this.downloadOutput());

        // File upload
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileUpload(e));

        // Key strength monitoring
        document.getElementById('encryption-key').addEventListener('input', (e) => this.checkKeyStrength(e.target.value));

        // Real-time input monitoring
        document.getElementById('input-text').addEventListener('input', (e) => this.handleInputChange(e.target.value));
    }

    setupAnimations() {
        // Add particle effects
        this.createParticles();
        
        // Add typing animation to output
        this.setupTypingAnimation();
        
        // Add hover effects
        this.setupHoverEffects();
    }

    createParticles() {
        const particlesContainer = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(0, 212, 255, 0.6);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    setupTypingAnimation() {
        const outputTextarea = document.getElementById('output-text');
        let typingInterval;

        this.originalSetValue = outputTextarea.setAttribute.bind(outputTextarea, 'value');
        outputTextarea.setAttribute = function(name, value) {
            if (name === 'value') {
                this.typeText(value);
            } else {
                this.originalSetValue(name, value);
            }
        };

        outputTextarea.typeText = function(text) {
            if (typingInterval) clearInterval(typingInterval);
            this.value = '';
            let index = 0;
            typingInterval = setInterval(() => {
                if (index < text.length) {
                    this.value += text[index];
                    index++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 10);
        };
    }

    setupHoverEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.action-btn, .output-btn, .mode-btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => this.createRipple(e));
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update button text
        const btnText = document.querySelector('.btn-text');
        btnText.textContent = mode === 'encrypt' ? 'Encrypt' : 'Decrypt';

        // Update placeholder
        const inputTextarea = document.getElementById('input-text');
        inputTextarea.placeholder = mode === 'encrypt' 
            ? 'Enter text to encrypt...' 
            : 'Enter encrypted text to decrypt...';

        // Add animation
        this.addModeSwitchAnimation();
    }

    addModeSwitchAnimation() {
        const panel = document.querySelector('.encryption-panel');
        panel.style.transform = 'scale(0.98)';
        setTimeout(() => {
            panel.style.transform = 'scale(1)';
        }, 150);
    }

    generateKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let key = '';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        document.getElementById('encryption-key').value = key;
        this.checkKeyStrength(key);
        this.showNotification('Strong key generated!', 'success');
    }

    togglePasswordVisibility() {
        const keyInput = document.getElementById('encryption-key');
        const toggleBtn = document.getElementById('toggle-key');
        const icon = toggleBtn.querySelector('i');

        if (keyInput.type === 'password') {
            keyInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            keyInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    checkKeyStrength(key) {
        let strength = 0;
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');

        // Check length
        if (key.length >= 8) strength += 25;
        if (key.length >= 12) strength += 25;
        if (key.length >= 16) strength += 25;

        // Check complexity
        if (/[a-z]/.test(key)) strength += 10;
        if (/[A-Z]/.test(key)) strength += 10;
        if (/[0-9]/.test(key)) strength += 10;
        if (/[^A-Za-z0-9]/.test(key)) strength += 10;

        // Update UI
        strengthFill.style.width = `${strength}%`;

        if (strength < 40) {
            strengthText.textContent = 'Weak';
            strengthFill.style.background = '#ff4444';
        } else if (strength < 70) {
            strengthText.textContent = 'Medium';
            strengthFill.style.background = '#ffaa00';
        } else {
            strengthText.textContent = 'Strong';
            strengthFill.style.background = '#00ff88';
        }
    }

    async processData() {
        const inputText = document.getElementById('input-text').value.trim();
        const key = document.getElementById('encryption-key').value.trim();
        const includeIV = document.getElementById('include-iv').checked;
        const base64Output = document.getElementById('base64-output').checked;

        if (!inputText) {
            this.showNotification('Please enter text to process!', 'error');
            return;
        }

        if (!key) {
            this.showNotification('Please enter an encryption key!', 'error');
            return;
        }

        // Add loading state
        const processBtn = document.getElementById('process-btn');
        processBtn.classList.add('loading');
        processBtn.disabled = true;

        try {
            let result;
            if (this.currentMode === 'encrypt') {
                result = await this.encrypt(inputText, key, includeIV, base64Output);
            } else {
                result = await this.decrypt(inputText, key, includeIV, base64Output);
            }

            document.getElementById('output-text').value = result;
            this.addToHistory(this.currentMode);
            this.showNotification(`${this.currentMode === 'encrypt' ? 'Encryption' : 'Decryption'} completed successfully!`, 'success');

        } catch (error) {
            this.showNotification(`Error: ${error.message}`, 'error');
        } finally {
            processBtn.classList.remove('loading');
            processBtn.disabled = false;
        }
    }

    async encrypt(text, key, includeIV = true, base64Output = true) {
        // Generate salt and derive key using PBKDF2
        const salt = CryptoJS.lib.WordArray.random(128/8);
        const derivedKey = CryptoJS.PBKDF2(key, salt, {
            keySize: 256/32,
            iterations: 10000
        });

        // Generate IV
        const iv = CryptoJS.lib.WordArray.random(128/8);

        // Encrypt the text
        const encrypted = CryptoJS.AES.encrypt(text, derivedKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        // Combine salt, IV, and encrypted data
        let result;
        if (includeIV) {
            result = salt.toString() + iv.toString() + encrypted.ciphertext.toString();
        } else {
            result = salt.toString() + encrypted.ciphertext.toString();
        }

        return base64Output ? btoa(result) : result;
    }

    async decrypt(encryptedText, key, includeIV = true, base64Output = true) {
        try {
            // Decode if base64
            const decodedText = base64Output ? atob(encryptedText) : encryptedText;

            // Extract salt (32 bytes)
            const salt = CryptoJS.enc.Hex.parse(decodedText.substr(0, 32));
            
            // Extract IV if included
            let iv, ciphertext;
            if (includeIV) {
                iv = CryptoJS.enc.Hex.parse(decodedText.substr(32, 32));
                ciphertext = CryptoJS.enc.Hex.parse(decodedText.substr(64));
            } else {
                ciphertext = CryptoJS.enc.Hex.parse(decodedText.substr(32));
                // Generate IV from key for decryption (not recommended for production)
                iv = CryptoJS.PBKDF2(key, salt, {
                    keySize: 128/32,
                    iterations: 1
                });
            }

            // Derive key using PBKDF2
            const derivedKey = CryptoJS.PBKDF2(key, salt, {
                keySize: 256/32,
                iterations: 10000
            });

            // Decrypt
            const decrypted = CryptoJS.AES.decrypt({
                ciphertext: ciphertext
            }, derivedKey, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);

        } catch (error) {
            throw new Error('Decryption failed. Please check your key and encrypted text.');
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('input-text').value = e.target.result;
            this.showNotification(`File "${file.name}" loaded successfully!`, 'success');
        };
        reader.readAsText(file);
    }

    handleInputChange(text) {
        // Add real-time character count
        const charCount = text.length;
        const maxChars = 10000;
        
        if (charCount > maxChars * 0.9) {
            document.getElementById('input-text').style.borderColor = '#ff4444';
        } else {
            document.getElementById('input-text').style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    }

    copyOutput() {
        const outputText = document.getElementById('output-text').value;
        if (!outputText) {
            this.showNotification('No output to copy!', 'error');
            return;
        }

        navigator.clipboard.writeText(outputText).then(() => {
            this.showNotification('Output copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy to clipboard!', 'error');
        });
    }

    downloadOutput() {
        const outputText = document.getElementById('output-text').value;
        if (!outputText) {
            this.showNotification('No output to download!', 'error');
            return;
        }

        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `encrypted_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('File downloaded successfully!', 'success');
    }

    clearAll() {
        document.getElementById('input-text').value = '';
        document.getElementById('output-text').value = '';
        document.getElementById('encryption-key').value = '';
        document.getElementById('file-input').value = '';
        
        // Reset key strength
        document.getElementById('strength-fill').style.width = '0%';
        document.getElementById('strength-text').textContent = 'Weak';
        
        this.showNotification('All fields cleared!', 'success');
    }

    addToHistory(operation) {
        const historyItem = {
            type: operation,
            timestamp: new Date(),
            time: 'Just now'
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history.pop();
        }

        this.updateHistoryUI();
        this.saveHistory();
    }

    updateHistoryUI() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-type ${item.type}">${item.type === 'encrypt' ? 'Encrypted' : 'Decrypted'}</span>
                <span class="history-time">${item.time}</span>
            `;
            historyList.appendChild(historyItem);
        });
    }

    saveHistory() {
        localStorage.setItem('encryptor_history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('encryptor_history');
        if (saved) {
            this.history = JSON.parse(saved);
            this.updateHistoryUI();
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('i');
        const text = notification.querySelector('.notification-text');

        // Update icon and text
        icon.className = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle';
        text.textContent = message;

        // Show notification
        notification.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .particle {
        position: absolute;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new SecureEncryptor();
    
    // Add some initial particles
    setTimeout(() => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;
        });
    }, 100);
}); 