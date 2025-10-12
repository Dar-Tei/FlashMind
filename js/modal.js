// modal.js - Modal window manager

const icons = {
   alertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
   alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
   checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
   info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
};

export class ModalManager {
   constructor() {
       this.currentModal = null;
   }

   // Show confirmation modal
   confirm(options) {
       return new Promise((resolve) => {
           const {
               title = 'Підтвердження',
               message = 'Ви впевнені?',
               confirmText = 'Підтвердити',
               cancelText = 'Скасувати',
               type = 'warning'
           } = options;

           this.show({
               title,
               message,
               type,
               buttons: [
                   {
                       text: cancelText,
                       class: 'btn-secondary',
                       onClick: () => {
                           this.close();
                           resolve(false);
                       }
                   },
                   {
                       text: confirmText,
                       class: type === 'warning' ? 'btn-red' : 'btn-gradient',
                       onClick: () => {
                           this.close();
                           resolve(true);
                       }
                   }
               ]
           });
       });
   }

   // Show alert modal
   alert(options) {
       return new Promise((resolve) => {
           const {
               title = 'Повідомлення',
               message = '',
               type = 'info',
               buttonText = 'Зрозуміло'
           } = options;

           this.show({
               title,
               message,
               type,
               buttons: [
                   {
                       text: buttonText,
                       class: 'btn-gradient',
                       onClick: () => {
                           this.close();
                           resolve();
                       }
                   }
               ]
           });
       });
   }

   // Show custom modal
   show(options) {
       const {
           title,
           message,
           type = 'info',
           buttons = []
       } = options;

       // Remove existing modal
       this.close();

       // Get icon based on type
       let iconSvg = icons.info;
       if (type === 'warning') iconSvg = icons.alertTriangle;
       if (type === 'error') iconSvg = icons.alertCircle;
       if (type === 'success') iconSvg = icons.checkCircle;

       // Create modal HTML
       const modalHTML = `
           <div class="modal-overlay" id="modal-overlay">
               <div class="modal-content">
                   <div class="modal-header">
                       <div class="modal-icon ${type}">
                           ${iconSvg}
                       </div>
                       <h3 class="modal-title">${title}</h3>
                   </div>
                   <div class="modal-body">
                       ${message}
                   </div>
                   <div class="modal-actions">
                       ${buttons.map((btn, index) => `
                           <button class="btn ${btn.class}" data-modal-btn="${index}">
                               ${btn.text}
                           </button>
                       `).join('')}
                   </div>
               </div>
           </div>
       `;

       // Add to DOM
       document.body.insertAdjacentHTML('beforeend', modalHTML);
       
       this.currentModal = document.getElementById('modal-overlay');

       // Attach button handlers
       buttons.forEach((btn, index) => {
           const btnElement = this.currentModal.querySelector(`[data-modal-btn="${index}"]`);
           if (btnElement) {
               btnElement.addEventListener('click', btn.onClick);
           }
       });

       // Close on overlay click
       this.currentModal.addEventListener('click', (e) => {
           if (e.target === this.currentModal) {
               const cancelButton = buttons.find(btn => btn.class.includes('secondary'));
               if (cancelButton) {
                   cancelButton.onClick();
               }
           }
       });

       // Close on ESC key
       const escHandler = (e) => {
           if (e.key === 'Escape') {
               const cancelButton = buttons.find(btn => btn.class.includes('secondary'));
               if (cancelButton) {
                   cancelButton.onClick();
               }
               document.removeEventListener('keydown', escHandler);
           }
       };
       document.addEventListener('keydown', escHandler);
   }

   // Close modal
   close() {
       if (this.currentModal) {
           this.currentModal.remove();
           this.currentModal = null;
       }
   }
}