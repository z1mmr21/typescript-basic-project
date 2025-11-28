"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');
const loadDataBtn = document.getElementById('loadDataBtn');
const dataGrid = document.getElementById('dataGrid');
const navbar = document.querySelector('.navbar');
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'flex';
        }
    });
}
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (modal) {
            modal.style.display = 'none';
        }
    });
}
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar === null || navbar === void 0 ? void 0 : navbar.classList.add('scrolled');
    }
    else {
        navbar === null || navbar === void 0 ? void 0 : navbar.classList.remove('scrolled');
    }
});
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            loadDataBtn.textContent = 'Loading...';
            loadDataBtn.disabled = true;
            const response = yield fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = yield response.json();
            renderUsers(users);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            dataGrid.innerHTML = '<p style="color: red;">Failed to load data. Please try again.</p>';
        }
        finally {
            loadDataBtn.textContent = 'Load Users';
            loadDataBtn.disabled = false;
        }
    });
}
function renderUsers(users) {
    dataGrid.innerHTML = '';
    users.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
        `;
        dataGrid.appendChild(card);
    });
}
if (loadDataBtn) {
    loadDataBtn.addEventListener('click', fetchUsers);
}
console.log('TypeScript interactivity initialized.');
