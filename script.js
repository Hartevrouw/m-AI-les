// ============================================
// Modal Management
// ============================================

const modal = document.getElementById('aiModal');
const modalTitle = document.getElementById('modalTitle');
const topicName = document.getElementById('topicName');
const modalClose = document.querySelector('.modal-close');
const topicCards = document.querySelectorAll('.topic-card');

// Topic names mapping
const topicNames = {
    'context': 'Context Explorer',
    'learning-question': 'Learning Question Explorer',
    'lesson': 'Lesson Explorer',
    'evaluator': 'Evaluator'
};

// Open modal when topic card is clicked
topicCards.forEach(card => {
    card.addEventListener('click', () => {
        const topic = card.getAttribute('data-topic');
        openModal(topic);
    });
});

// Open modal function
function openModal(topic) {
    const name = topicNames[topic] || 'AI Gesprek';
    modalTitle.textContent = name;
    topicName.textContent = name.toLowerCase();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const userInput = document.getElementById('userInput');
        if (userInput) {
            userInput.focus();
        }
    }, 100);
}

// Close modal function
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = '';
    }
}

// Close modal when close button is clicked
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal when clicking outside of it
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ============================================
// Chat Functionality
// ============================================

const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) {
        return;
    }
    
    addUserMessage(message);
    userInput.value = '';
    
    setTimeout(() => {
        addAIMessage(getAIResponse(message));
    }, 1000);
}

function addUserMessage(message) {
    const chatContainer = document.querySelector('.ai-chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `
        <div class="ai-avatar" style="background-color: var(--accent-teal);">Jij</div>
        <div class="message-content" style="background-color: #e8f4f5;">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    
    const inputContainer = document.querySelector('.chat-input-container');
    chatContainer.insertBefore(messageDiv, inputContainer);
    scrollToBottom();
}

function addAIMessage(message) {
    const chatContainer = document.querySelector('.ai-chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ai-message';
    messageDiv.innerHTML = `
        <div class="ai-avatar">AI</div>
        <div class="message-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    
    const inputContainer = document.querySelector('.chat-input-container');
    chatContainer.insertBefore(messageDiv, inputContainer);
    scrollToBottom();
}

function scrollToBottom() {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = modalBody.scrollHeight;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hallo') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return 'Hallo! Ik ben hier om je te helpen. Wat wil je graag bespreken?';
    } else if (lowerMessage.includes('help')) {
        return 'Ik kan je helpen met het verkennen van verschillende aspecten van je lespraktijk. Stel gerust je vragen!';
    } else if (lowerMessage.includes('bedankt') || lowerMessage.includes('dank')) {
        return 'Graag gedaan! Als je nog meer vragen hebt, laat het me weten.';
    } else {
        return 'Dat is een interessante vraag. Kun je wat meer details geven zodat ik je beter kan helpen?';
    }
}

if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (userInput) {
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// ============================================
// Submenu Toggle - Dynamic Height
// ============================================

// Function to adjust menu height dynamically
function adjustMenuHeight(menu) {
    if (!menu) return;
    
    menu.style.height = 'auto';
    const naturalHeight = menu.scrollHeight;
    const viewportHeight = window.innerHeight;
    const menuTop = menu.getBoundingClientRect().top;
    const availableHeight = viewportHeight - menuTop - 20;
    
    if (naturalHeight <= availableHeight) {
        menu.style.height = naturalHeight + 'px';
        menu.style.overflow = 'visible';
    } else {
        menu.style.height = availableHeight + 'px';
        menu.style.overflowY = 'auto';
    }
}

// Function to adjust submenu position and height
function adjustSubmenuPosition(submenu) {
    if (!submenu) return;
    
    submenu.style.height = 'auto';
    const naturalHeight = submenu.scrollHeight;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const rect = submenu.getBoundingClientRect();
    
    // Check if submenu goes off right edge
    if (rect.right > viewportWidth) {
        submenu.style.left = 'auto';
        submenu.style.right = '100%';
        submenu.style.marginLeft = '0';
        submenu.style.marginRight = '0.5rem';
    }
    
    // Check vertical space
    const availableHeight = viewportHeight - rect.top - 20;
    if (naturalHeight <= availableHeight) {
        submenu.style.height = naturalHeight + 'px';
        submenu.style.overflow = 'visible';
    } else {
        submenu.style.height = availableHeight + 'px';
        submenu.style.overflowY = 'auto';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Get all submenu links
    const submenuLinks = document.querySelectorAll('.submenu-link');
    
    // Add click handler to each submenu link
    submenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const submenuItem = this.closest('.dropdown-submenu');
            if (!submenuItem) return;
            
            const submenu = submenuItem.querySelector('.submenu');
            if (!submenu) return;
            
            const isShowing = submenuItem.classList.contains('show');
            
            // Close all other submenus at the same level
            const parent = submenuItem.parentElement;
            if (parent) {
                const siblings = parent.querySelectorAll('.dropdown-submenu');
                siblings.forEach(sibling => {
                    if (sibling !== submenuItem) {
                        sibling.classList.remove('show');
                    }
                });
            }
            
            // Toggle current submenu
            if (isShowing) {
                submenuItem.classList.remove('show');
            } else {
                submenuItem.classList.add('show');
                setTimeout(() => {
                    adjustSubmenuPosition(submenu);
                }, 10);
            }
        });
    });
    
    // Adjust dropdown menu height on hover
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdown.addEventListener('mouseenter', () => {
                setTimeout(() => {
                    adjustMenuHeight(dropdownMenu);
                }, 10);
            });
        }
    }
    
    // Adjust submenu heights on hover
    document.querySelectorAll('.dropdown-submenu').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                setTimeout(() => {
                    adjustSubmenuPosition(submenu);
                }, 10);
            }
        });
    });
    
    // Adjust on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (dropdownMenu && dropdownMenu.style.opacity !== '0') {
                adjustMenuHeight(dropdownMenu);
            }
            document.querySelectorAll('.submenu').forEach(submenu => {
                const parent = submenu.closest('.dropdown-submenu');
                if (parent && (parent.classList.contains('show') || parent.matches(':hover'))) {
                    adjustSubmenuPosition(submenu);
                }
            });
        }, 100);
    });
    
    // Close submenus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-submenu').forEach(item => {
                item.classList.remove('show');
            });
        }
    });
});

// ============================================
// Accessibility
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    topicCards.forEach(card => {
        const topic = card.getAttribute('data-topic');
        card.setAttribute('aria-label', `Open ${topicNames[topic] || topic}`);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
    });
    
    topicCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'modalTitle');
        modal.setAttribute('aria-modal', 'true');
    }
});

