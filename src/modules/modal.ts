export function initModal(): void {
    const modal = document.getElementById('modal') as HTMLElement;
    const openModalBtn = document.getElementById('openModalBtn') as HTMLButtonElement;
    const closeBtn = document.querySelector('.close-btn') as HTMLElement;

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

    window.addEventListener('click', (event: MouseEvent) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
