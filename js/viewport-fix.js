// viewport-fix.js - Fix for mobile browser address bar height issues

export class ViewportFix {
   constructor() {
       this.init();
   }

   init() {
       // Set a CSS variable with the actual viewport height
       this.setViewportHeight();

       // Update on window resize
       window.addEventListener('resize', () => this.setViewportHeight());
       
       // Update on orientation change
       window.addEventListener('orientationchange', () => {
           setTimeout(() => this.setViewportHeight(), 100);
       });

       // Update on scroll (for Chrome on Android)
       let ticking = false;
       window.addEventListener('scroll', () => {
           if (!ticking) {
               window.requestAnimationFrame(() => {
                   this.setViewportHeight();
                   ticking = false;
               });
               ticking = true;
           }
       });

       // Update when focusing on an input (mobile keyboard)
       document.addEventListener('focusin', () => {
           setTimeout(() => this.setViewportHeight(), 300);
       });

       document.addEventListener('focusout', () => {
           setTimeout(() => this.setViewportHeight(), 300);
       });
   }

   setViewportHeight() {
       // Get the actual viewport height
       const vh = window.innerHeight * 0.01;
       
       // Set the CSS variable --vh
       document.documentElement.style.setProperty('--vh', `${vh}px`);

       // Also set --real-vh for precise calculations
       document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);

       // For Safari on iOS
       if (this.isIOS()) {
           const visualViewport = window.visualViewport;
           if (visualViewport) {
               const vvh = visualViewport.height * 0.01;
               document.documentElement.style.setProperty('--vvh', `${vvh}px`);
           }
       }
   }

   isIOS() {
       return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
   }

   isAndroid() {
       return /Android/.test(navigator.userAgent);
   }

   isMobile() {
       return this.isIOS() || this.isAndroid();
   }
}

// Additional helper to check if the fix is needed
export function needsViewportFix() {
   // Check if it's a mobile browser
   const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
   
   // Check if it's Chrome on Android
   const isChrome = /Chrome/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
   
   // Check if it's Safari on iOS
   const isSafari = /Safari/.test(navigator.userAgent) && /iPhone|iPad/.test(navigator.userAgent);
   
   return isMobile && (isChrome || isSafari);
}

// Initialize automatically
if (needsViewportFix()) {
   new ViewportFix();
}
