let loggedInUser = {
    name: "User",
    profilePicUrl: "" // empty means no profile picture uploaded
};

function getFirstLetter(name) {
    return name ? name.charAt(0).toUpperCase() : 'U';
}

function updateProfileDisplay() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.username) {
        loggedInUser.name = userData.username;
        loggedInUser.profilePicUrl = userData.profilePicUrl || "";
    }

    const profilePics = document.querySelectorAll('#profile-pic');
    const profileNames = document.querySelectorAll('#profile-name');

    profilePics.forEach(pic => {
        if (loggedInUser.profilePicUrl) {
            pic.src = loggedInUser.profilePicUrl;
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 80;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#E5E7EB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#1F2937';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(getFirstLetter(loggedInUser.name), canvas.width / 2, canvas.height / 2);
            pic.src = canvas.toDataURL();
        }
    });

    profileNames.forEach(nameElem => {
        nameElem.textContent = loggedInUser.name || 'User';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateProfileDisplay();
});

// Dynamic search functionality for all search bars on the page

function performSearchFromInput(inputElement) {
    const query = inputElement.value.trim().toLowerCase();
    if (!query) {
        alert('Please enter a search term');
        return null;
    }
    // Define the language links
    const links = [
        { text: 'html', url: 'https://www.geeksforgeeks.org/html/html-tutorial/' },
        { text: 'css', url: 'https://www.geeksforgeeks.org/css/css-cheat-sheet-a-basic-guide-to-css/' },
        { text: 'javascript', url: 'https://www.geeksforgeeks.org/javascript/javascript-tutorial/' },
        { text: 'react', url: 'https://www.geeksforgeeks.org/reactjs/react/' },
        { text: 'python', url: 'https://www.geeksforgeeks.org/python/python-programming-language-tutorial/' },
        { text: 'node.js', url: 'https://www.geeksforgeeks.org/node-js/nodejs/' },
        { text: 'php', url: 'https://www.geeksforgeeks.org/php/php-tutorial/' },
        { text: 'sql', url: 'https://www.geeksforgeeks.org/sql/sql-tutorial/' },
        { text: 'java', url: 'https://www.geeksforgeeks.org/java/java/' },
        { text: 'c++', url: 'https://www.geeksforgeeks.org/cpp/c-plus-plus/' },
        { text: 'typescript', url: 'https://www.geeksforgeeks.org/typescript/typescript-tutorial/' },
        { text: 'c#', url: 'https://www.geeksforgeeks.org/c-sharp/csharp-tutorial/' },
        { text: 'leetcode', url: 'https://leetcode.com/' },
        { text: 'hackerrank', url: 'https://www.hackerrank.com/' },
        { text: 'codechef', url: 'https://www.codechef.com/' },
        { text: 'geeksforgeeks practice', url: 'https://www.geeksforgeeks.org/explore' }
    ];
    const found = links.find(link => link.text === query);
    if (found) {
        return found.url;
    } else {
        alert('No matching language found for "' + query + '"');
        return null;
    }
}

let lastOpenedWindow = null;

document.querySelectorAll('.searchbar-container').forEach(container => {
    const input = container.querySelector('.searchbar-input');
    const button = container.querySelector('.search-btn');
    if (input && button) {
        button.addEventListener('click', () => {
            if (lastOpenedWindow && !lastOpenedWindow.closed) {
                lastOpenedWindow.close();
            }
            const found = performSearchFromInput(input);
            if (found) {
                lastOpenedWindow = window.open(found, '_blank');
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (lastOpenedWindow && !lastOpenedWindow.closed) {
                    lastOpenedWindow.close();
                }
                const found = performSearchFromInput(input);
                if (found) {
                    lastOpenedWindow = window.open(found, '_blank');
                }
            }
        });
    }
});

// Chatbot functionality
let pastUserInputs = [];
let generatedResponses = [];

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = sender === 'user' ? 'user-message' : 'bot-message';
    msg.textContent = text;
    document.getElementById('chat-messages').appendChild(msg);
    document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
}

async function sendMessage(text) {
    addMessage(text, 'user');
    pastUserInputs.push(text);

    const token = localStorage.getItem('token');
    if (!token) {
        addMessage('Please log in to use the chatbot.', 'bot');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/chatbot/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (response.ok) {
            addMessage(data.response, 'bot');
            generatedResponses.push(data.response);
        } else {
            addMessage('Sorry, there was an error processing your request.', 'bot');
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        addMessage('Network error. Please try again.', 'bot');
    }
}

// Improvement Comment Widget functionality
document.getElementById('improve-button').addEventListener('click', () => {
    const modal = document.getElementById('improve-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('close-improve').addEventListener('click', () => {
    document.getElementById('improve-modal').style.display = 'none';
});

document.getElementById('cancel-improve').addEventListener('click', () => {
    document.getElementById('improve-modal').style.display = 'none';
});

document.getElementById('improve-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const category = document.getElementById('improve-category').value;
    const rating = document.getElementById('improve-rating').value;
    const comment = document.getElementById('improve-comment').value.trim();

    if (!category || !rating || !comment) {
        alert('Please fill in all fields.');
        return;
    }

    try {
fetch('http://localhost:8082/api/improvements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, rating: parseInt(rating), comment })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Thank you for your feedback!');
            // Reset form and close modal
            e.target.reset();
            document.getElementById('improve-modal').style.display = 'none';
        } else {
            alert(data.message || 'Error submitting feedback.');
        }
    } catch (error) {
        console.error('Comment submission error:', error);
        alert('Network error. Please try again.');
    }
});

document.getElementById('chat-button').addEventListener('click', () => {
    const modal = document.getElementById('chat-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('close-chat').addEventListener('click', () => {
    document.getElementById('chat-modal').style.display = 'none';
});

document.getElementById('send-chat').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (text) {
        sendMessage(text);
        input.value = '';
    }
});

document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = e.target.value.trim();
        if (text) {
            sendMessage(text);
            e.target.value = '';
        }
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Make logout function globally available
window.logout = logout;
