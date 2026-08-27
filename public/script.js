/**
 * Code Guide - Professional Platform Client JavaScript
 * Handles Theme, Search (Ctrl+K), AI Chatbot, Feedback, Progress Tracking & Toasts
 */

// Initialize Theme
(function initTheme() {
  const savedTheme = localStorage.getItem('codeguide_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Toast Notification Manager
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// User Progress & Gamification Manager
const ProgressManager = {
  get() {
    const raw = localStorage.getItem('codeguide_user_progress');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return {
      xp: 1450,
      level: 4,
      streak: 5,
      completed: ['python-intro', 'js-arrays', 'html-semantic', 'dsa-arrays'],
      bookmarks: []
    };
  },
  save(data) {
    localStorage.setItem('codeguide_user_progress', JSON.stringify(data));
  },
  toggleComplete(topicId) {
    const data = this.get();
    const idx = data.completed.indexOf(topicId);
    if (idx > -1) {
      data.completed.splice(idx, 1);
      data.xp = Math.max(0, data.xp - 50);
      showToast(`Marked as incomplete (-50 XP)`, 'info');
    } else {
      data.completed.push(topicId);
      data.xp += 50;
      data.level = Math.floor(data.xp / 400) + 1;
      showToast(`Topic completed! +50 XP (Total XP: ${data.xp})`, 'success');
    }
    this.save(data);
    this.updateUI();
    return data.completed.includes(topicId);
  },
  updateUI() {
    const data = this.get();
    const xpElements = document.querySelectorAll('.user-xp-val');
    xpElements.forEach(el => el.textContent = data.xp);
    const levelElements = document.querySelectorAll('.user-lvl-val');
    levelElements.forEach(el => el.textContent = data.level);
    const streakElements = document.querySelectorAll('.user-streak-val');
    streakElements.forEach(el => el.textContent = data.streak);

    document.querySelectorAll('[data-topic-id]').forEach(btn => {
      const topicId = btn.getAttribute('data-topic-id');
      if (data.completed.includes(topicId)) {
        btn.classList.add('completed');
        btn.innerHTML = '✓ Completed';
      } else {
        btn.classList.remove('completed');
        btn.innerHTML = 'Mark Complete';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('codeguide_theme', next);
      showToast(`Switched to ${next} theme`, 'info');
    });
  });

  // 2. User Profile Dropdown
  const avatarBtn = document.getElementById('user-avatar-btn');
  const dropdownMenu = document.getElementById('profile-dropdown');
  if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target) && e.target !== avatarBtn) {
        dropdownMenu.classList.remove('show');
      }
    });
  }

  // 3. Search Bar Shortcut (Ctrl+K or ⌘K)
  const searchInputs = document.querySelectorAll('.searchbar-input');
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = encodeURIComponent(input.value.trim());
        if (q) window.location.href = `explore.html?q=${q}`;
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const firstSearch = document.querySelector('.searchbar-input');
      if (firstSearch) {
        firstSearch.focus();
        firstSearch.select();
      }
    }
  });

  // 4. Progress Gamification Checkboxes
  ProgressManager.updateUI();
  document.querySelectorAll('[data-topic-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-topic-id');
      ProgressManager.toggleComplete(id);
    });
  });

  // 5. Improvement / Feedback Modal
  const improveButton = document.getElementById('improve-button');
  const improveModal = document.getElementById('improve-modal');
  const closeImprove = document.getElementById('close-improve');
  const cancelImprove = document.getElementById('cancel-improve');
  const improveForm = document.getElementById('improve-form');

  if (improveButton && improveModal) {
    improveButton.addEventListener('click', () => {
      const isVisible = improveModal.style.display === 'flex';
      improveModal.style.display = isVisible ? 'none' : 'flex';
    });
  }

  if (closeImprove && improveModal) {
    closeImprove.addEventListener('click', () => improveModal.style.display = 'none');
  }
  if (cancelImprove && improveModal) {
    cancelImprove.addEventListener('click', () => improveModal.style.display = 'none');
  }

  if (improveForm) {
    improveForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const category = document.getElementById('improve-category')?.value;
      const rating = document.getElementById('improve-rating')?.value;
      const comment = document.getElementById('improve-comment')?.value?.trim();

      if (!category || !rating || !comment) {
        showToast('Please fill in all feedback fields.', 'error');
        return;
      }

      try {
        const response = await fetch('/api/improvements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, rating, comment })
        });
        const resData = await response.json();
        if (response.ok) {
          showToast(resData.message || 'Feedback submitted successfully!', 'success');
          improveForm.reset();
          if (improveModal) improveModal.style.display = 'none';
        } else {
          showToast(resData.error || 'Failed to submit feedback.', 'error');
        }
      } catch (err) {
        showToast('Network error while submitting feedback.', 'error');
      }
    });
  }

  // 6. AI Assistant Chatbot
  const chatButton = document.getElementById('chat-button');
  const chatModal = document.getElementById('chat-modal');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendChat = document.getElementById('send-chat');
  const chatMessages = document.getElementById('chat-messages');

  if (chatButton && chatModal) {
    chatButton.addEventListener('click', () => {
      const isVisible = chatModal.style.display === 'flex';
      chatModal.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible && chatInput) chatInput.focus();
    });
  }

  if (closeChat && chatModal) {
    closeChat.addEventListener('click', () => chatModal.style.display = 'none');
  }

  function addChatMessage(text, sender, codeSnippet = '') {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    
    let html = `<div>${text}</div>`;
    if (codeSnippet) {
      html += `<pre style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; margin-top: 6px; font-family: monospace; font-size: 0.8rem; overflow-x: auto;"><code>${codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    }
    msg.innerHTML = html;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleSendChat() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    chatInput.value = '';

    // Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot';
    typingIndicator.id = 'chat-typing-indicator';
    typingIndicator.textContent = 'Thinking... ⚡';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      typingIndicator.remove();

      if (res.ok) {
        addChatMessage(data.response, 'bot', data.codeSnippet);
      } else {
        addChatMessage(data.error || 'Sorry, could not process that query.', 'bot');
      }
    } catch (err) {
      typingIndicator.remove();
      addChatMessage('Error communicating with Code Guide AI assistant.', 'bot');
    }
  }

  if (sendChat) sendChat.addEventListener('click', handleSendChat);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSendChat();
    });
  }
});

// Helper for quick prompts
function sendQuickPrompt(promptText) {
  const chatInput = document.getElementById('chat-input');
  const chatModal = document.getElementById('chat-modal');
  if (chatModal) chatModal.style.display = 'flex';
  if (chatInput) {
    chatInput.value = promptText;
    const sendChat = document.getElementById('send-chat');
    if (sendChat) sendChat.click();
  }
}

// User Logout
function logout() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_data');
  showToast('Logged out securely.', 'info');
  setTimeout(() => {
    window.location.href = 'landing.html';
  }, 500);
}
