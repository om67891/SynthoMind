// Chat state
let chatHistory = [];
let automatedQuestionInterval;

// DOM Elements
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.send-btn');
const historyList = document.querySelector('.history-list');
const newChatButton = document.querySelector('.new-chat-btn');

// Initialize chat
function initializeChat() {
    // Start checking for automated questions
    startAutomatedQuestionCheck();
    
    // Add event listeners
    sendButton.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', handleInputKeypress);
    newChatButton.addEventListener('click', startNewChat);
}

// Handle send message
async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to UI
    appendMessage('user', message);
    chatInput.value = '';

    try {
        // Show typing indicator
        showTypingIndicator();

        // Send message to backend
        const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();

        if (data.success) {
            // Add bot response to UI
            appendMessage('bot', data.answer);
            
            // Add to chat history
            updateChatHistory({
                userMessage: message,
                botResponse: data.answer,
                timestamp: new Date()
            });
        } else {
            throw new Error(data.error || 'Failed to get response');
        }
    } catch (error) {
        console.error('Chat Error:', error);
        hideTypingIndicator();
        appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
}

// Check for automated questions
async function checkAutomatedQuestions() {
    try {
        const response = await fetch('/api/chat/automated-questions');
        const data = await response.json();

        if (data.success && data.questions.length > 0) {
            data.questions.forEach(question => {
                appendMessage('bot', question.question);
            });
        }
    } catch (error) {
        console.error('Error checking automated questions:', error);
    }
}

// Start automated question check
function startAutomatedQuestionCheck() {
    // Check every 30 seconds
    automatedQuestionInterval = setInterval(checkAutomatedQuestions, 30000);
}

// UI Helpers
function appendMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `
        <p>${content}</p>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// Chat History Management
function updateChatHistory(chat) {
    chatHistory.push(chat);
    updateHistoryList();
}

function updateHistoryList() {
    // Clear existing history items
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }

    // Add new history items
    chatHistory.slice().reverse().forEach((chat, index) => {
        const li = document.createElement('li');
        li.className = 'history-item' + (index === 0 ? ' active' : '');
        li.innerHTML = `
            <h4>${formatHistoryTitle(chat.userMessage)}</h4>
            <p>${truncateText(chat.userMessage, 40)}</p>
        `;
        historyList.appendChild(li);
    });
}

function formatHistoryTitle(message) {
    return truncateText(message, 25);
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function handleInputKeypress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

function startNewChat() {
    // Clear messages
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
    
    // Add welcome message
    appendMessage('bot', "Hello! I'm your MindCare assistant. How can I help you today?");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChat);

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (automatedQuestionInterval) {
        clearInterval(automatedQuestionInterval);
    }
});