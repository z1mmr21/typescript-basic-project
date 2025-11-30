import { User } from '../types/index';

export function initUserFetching(): void {
    const loadDataBtn = document.getElementById('loadDataBtn') as HTMLButtonElement;

    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', fetchUsers);
    }
}

async function fetchUsers(): Promise<void> {
    const loadDataBtn = document.getElementById('loadDataBtn') as HTMLButtonElement;
    const dataGrid = document.getElementById('dataGrid') as HTMLElement;

    try {
        if (loadDataBtn) {
            loadDataBtn.textContent = 'Loading...';
            loadDataBtn.disabled = true;
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users: User[] = await response.json();
        renderUsers(users);

    } catch (error) {
        console.error('Error fetching users:', error);
        if (dataGrid) {
            dataGrid.innerHTML = '<p style="color: red;">Failed to load data. Please try again.</p>';
        }
    } finally {
        if (loadDataBtn) {
            loadDataBtn.textContent = 'Load Users';
            loadDataBtn.disabled = false;
        }
    }
}

function renderUsers(users: User[]): void {
    const dataGrid = document.getElementById('dataGrid') as HTMLElement;
    if (!dataGrid) return;

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
