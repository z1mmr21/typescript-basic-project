import { initModal } from './modules/modal';
import { initUserFetching } from './modules/users';
import { initNavbar } from './modules/ui';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initUserFetching();
    initNavbar();
    console.log('Modules initialized.');
});
