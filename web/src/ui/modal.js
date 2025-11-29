export function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.tabIndex = -1;

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  dialog.role = 'dialog';
  dialog.ariaModal = 'true';

  const content = document.createElement('div');
  content.className = 'modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.className = 'modal-close';

  dialog.appendChild(content);
  dialog.appendChild(closeBtn);
  overlay.appendChild(dialog);

  function open(questionText) {
    content.textContent = questionText || '';
    document.body.appendChild(overlay);
    closeBtn.focus();
  }

  function close() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
    }
  });

  return { open, close, overlay, dialog, content, closeBtn };
}
