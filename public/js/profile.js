// Emergency Contact Management
class EmergencyContactManager {
    constructor() {
        this.bindEventListeners();
        this.maxContacts = 3;
    }

    bindEventListeners() {
        // Edit button
        document.getElementById('editContacts').addEventListener('click', () => this.toggleEditMode());
        
        // Add contact button
        document.getElementById('addParentBtn').addEventListener('click', () => this.addNewContact());
        
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => this.saveChanges());
        
        // Initial setup for remove buttons
        this.setupRemoveButtons();
    }

    toggleEditMode() {
        const editBtn = document.getElementById('editContacts');
        const isEditing = editBtn.innerHTML.includes('Save');
        
        // Toggle inputs
        document.querySelectorAll('.parent-item input').forEach(input => {
            input.disabled = !isEditing;
        });
        
        // Toggle remove buttons
        document.querySelectorAll('.remove-parent').forEach(btn => {
            btn.style.display = isEditing ? 'block' : 'none';
        });
        
        // Toggle add button
        document.getElementById('addParentBtn').style.display = isEditing ? 'block' : 'none';
        
        // Update button text
        editBtn.innerHTML = isEditing ? 
            '<i class="fas fa-edit"></i> Edit' : 
            '<i class="fas fa-save"></i> Save';
    }

    setupRemoveButtons() {
        document.querySelectorAll('.remove-parent').forEach(button => {
            button.addEventListener('click', (e) => {
                const parentItem = e.target.closest('.parent-item');
                if (parentItem) {
                    parentItem.remove();
                }
            });
        });
    }

    addNewContact() {
        const container = document.getElementById('parentInfoContainer');
        const currentContacts = container.querySelectorAll('.parent-item').length;
        
        if (currentContacts >= this.maxContacts) {
            showNotification('Maximum ' + this.maxContacts + ' emergency contacts allowed', 'warning');
            return;
        }

        const newContact = document.createElement('div');
        newContact.className = 'parent-item';
        newContact.innerHTML = `
            <div class="parent-header">
                <div class="parent-name">New Contact</div>
                <button class="remove-parent"><i class="fas fa-times"></i></button>
            </div>
            <div class="parent-details">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="form-control" placeholder="Contact Name">
                </div>
                <div class="form-group">
                    <label>Relation</label>
                    <input type="text" class="form-control" placeholder="Relationship">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" class="form-control" placeholder="Phone Number">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" placeholder="Email Address">
                </div>
            </div>
        `;

        container.appendChild(newContact);
        this.setupRemoveButtons();
    }

    collectContactData() {
        const contacts = [];
        document.querySelectorAll('.parent-item').forEach(item => {
            const inputs = item.querySelectorAll('input');
            const contact = {
                name: inputs[0].value.trim(),
                relation: inputs[1].value.trim(),
                phone: inputs[2].value.trim(),
                email: inputs[3].value.trim()
            };
            
            // Only add if all fields are filled
            if (contact.name && contact.relation && contact.phone && contact.email) {
                contacts.push(contact);
            }
        });
        return contacts;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePhone(phone) {
        return /^\+?[\d\s-]{10,}$/.test(phone);
    }

    validateContacts(contacts) {
        for (const contact of contacts) {
            if (!this.validateEmail(contact.email)) {
                showNotification(`Invalid email for contact: ${contact.name}`, 'error');
                return false;
            }
            if (!this.validatePhone(contact.phone)) {
                showNotification(`Invalid phone number for contact: ${contact.name}`, 'error');
                return false;
            }
        }
        return true;
    }

    async saveChanges() {
        const contacts = this.collectContactData();
        
        if (contacts.length === 0) {
            showNotification('Please add at least one emergency contact', 'warning');
            return;
        }

        if (!this.validateContacts(contacts)) {
            return;
        }

        try {
            const response = await fetch('/profile/update-emergency-contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contacts })
            });

            const data = await response.json();
            
            if (data.success) {
                showNotification('Emergency contacts updated successfully', 'success');
                this.toggleEditMode();
                // Refresh the contacts display
                location.reload();
            } else {
                throw new Error(data.error || 'Failed to update contacts');
            }
        } catch (error) {
            console.error('Error saving emergency contacts:', error);
            showNotification(error.message || 'Failed to save emergency contacts', 'error');
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmergencyContactManager();
});