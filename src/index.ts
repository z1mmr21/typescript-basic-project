// Define interface for User data from JSONPlaceholder
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
}

// DOM Elements
const modal = document.getElementById('modal') as HTMLElement;
const openModalBtn = document.getElementById('openModalBtn') as HTMLButtonElement;
const closeBtn = document.querySelector('.close-btn') as HTMLElement;
const loadDataBtn = document.getElementById('loadDataBtn') as HTMLButtonElement;
const dataGrid = document.getElementById('dataGrid') as HTMLElement;
const navbar = document.querySelector('.navbar') as HTMLElement;

// --- Modal Functionality ---

// Open modal
if (openModalBtn) {
  openModalBtn.addEventListener('click', () => {
    if (modal) {
      modal.style.display = 'flex';
    }
  });
}

// Close modal
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    if (modal) {
      modal.style.display = 'none';
    }
  });
}

// Close modal when clicking outside
window.addEventListener('click', (event: MouseEvent) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// --- Scroll Effect ---
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// --- Data Fetching ---

/**
 * Fetches user data from JSONPlaceholder API
 */
async function fetchUsers(): Promise<void> {
  try {
    loadDataBtn.textContent = 'Loading...';
    loadDataBtn.disabled = true;

    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users: User[] = await response.json();
    renderUsers(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    dataGrid.innerHTML = '<p style="color: red;">Failed to load data. Please try again.</p>';
  } finally {
    loadDataBtn.textContent = 'Load Users';
    loadDataBtn.disabled = false;
  }
}

/**
 * Renders user cards to the DOM
 * @param users Array of User objects
 */
function renderUsers(users: User[]): void {
  dataGrid.innerHTML = ''; // Clear existing content

  users.forEach((user, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    // Add staggered animation delay
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

// Attach event listener to load button
if (loadDataBtn) {
  loadDataBtn.addEventListener('click', fetchUsers);
}

console.log('TypeScript interactivity initialized.');
