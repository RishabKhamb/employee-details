// Utility to close the modal programatically
export function closeModal(exampleModal: HTMLElement): void {
    if (exampleModal) {
        exampleModal.classList.remove('show');
        exampleModal.setAttribute('aria-hidden', 'true');
        exampleModal.style.display = 'none';

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.classList.remove('show');
            backdrop.addEventListener('transitionend', () => {
                backdrop.remove();
            });
        }
        const datePickerBackdrops = document.querySelectorAll('.modal-backdrop.show');
        datePickerBackdrops.forEach((backdrop: any) => backdrop.remove());

        document.body.classList.remove('modal-open');
    }
}
