// dragdrop.js - Drag and Drop file upload module

export class DragDropManager {
    constructor(dropZoneSelector, onFileDropped) {
        this.dropZone = document.querySelector(dropZoneSelector);
        this.onFileDropped = onFileDropped;
        this.overlay = null;
        
        // Зберігаємо посилання на обробники для можливості їх видалення
        this.handleDragEnterBound = () => this.handleDragEnter();
        this.handleDragLeaveBound = (e) => this.handleDragLeave(e);
        this.handleDropBound = (e) => this.handleDrop(e);
        this.preventDefaultsBound = (e) => this.preventDefaults(e);
        
        if (this.dropZone) {
            this.init();
        }
    }

    init() {
        // Create drop overlay
        this.createOverlay();
        
        // Prevent default drag behaviors on document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, this.preventDefaultsBound, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            document.addEventListener(eventName, this.handleDragEnterBound, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, this.handleDragLeaveBound, false);
        });

        // Handle dropped files
        document.addEventListener('drop', this.handleDropBound, false);
    }

    createOverlay() {
        // Check if the overlay already exists and delete it
        const existingOverlay = document.querySelector('.drag-drop-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        this.overlay = document.createElement('div');
        this.overlay.className = 'drag-drop-overlay hidden';
        this.overlay.innerHTML = `
            <div class="drag-drop-content">
                <div class="drag-drop-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </div>
                <h3 class="drag-drop-title">Перетягніть JSON файл сюди</h3>
                <p class="drag-drop-subtitle">або натисніть, щоб вибрати файл</p>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        // Handle click on overlay to open file picker
        this.overlayClickHandler = () => this.openFilePicker();
        this.overlay.addEventListener('click', this.overlayClickHandler);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDragEnter() {
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            this.overlay.classList.add('visible');
        }
    }

    handleDragLeave(e) {
        // Only hide if we're leaving the document
        if (e && (e.target === document || e.target === document.documentElement)) {
            if (this.overlay) {
                this.overlay.classList.remove('visible');
                this.overlay.classList.add('hidden');
            }
        }
    }

    handleDrop(e) {
        if (this.overlay) {
            this.overlay.classList.remove('visible');
            this.overlay.classList.add('hidden');
        }

        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            this.handleFiles(files);
        }
    }

    handleFiles(files) {
        // Filter only JSON files
        const jsonFiles = Array.from(files).filter(file => 
            file.type === 'application/json' || file.name.endsWith('.json')
        );

        if (jsonFiles.length === 0) {
            if (this.onFileDropped) {
                this.onFileDropped({
                    success: false,
                    error: 'Будь ласка, перетягніть JSON файл'
                });
            }
            return;
        }

        // Process first JSON file
        this.readFile(jsonFiles[0]);
    }

    readFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validate JSON structure
                if (!data.name || !Array.isArray(data.cards)) {
                    if (this.onFileDropped) {
                        this.onFileDropped({
                            success: false,
                            error: 'Невірний формат файлу!'
                        });
                    }
                    return;
                }

                const validCards = data.cards.filter(c =>
                    c.question && c.answer &&
                    typeof c.question === 'string' &&
                    typeof c.answer === 'string'
                );

                if (validCards.length === 0) {
                    if (this.onFileDropped) {
                        this.onFileDropped({
                            success: false,
                            error: 'У файлі немає валідних карток!'
                        });
                    }
                    return;
                }

                // Success
                if (this.onFileDropped) {
                    this.onFileDropped({
                        success: true,
                        data: { name: data.name, cards: validCards }
                    });
                }
            } catch (error) {
                if (this.onFileDropped) {
                    this.onFileDropped({
                        success: false,
                        error: 'Помилка читання файлу. Переконайтесь, що це валідний JSON.'
                    });
                }
            }
        };

        reader.onerror = () => {
            if (this.onFileDropped) {
                this.onFileDropped({
                    success: false,
                    error: 'Помилка читання файлу'
                });
            }
        };

        reader.readAsText(file);
    }

    openFilePicker() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.multiple = false;

        input.onchange = (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                this.handleFiles(files);
            }
        };

        input.click();
        
        // Hide overlay after opening file picker
        if (this.overlay) {
            this.overlay.classList.remove('visible');
            this.overlay.classList.add('hidden');
        }
    }

    destroy() {
        // Remove overlay
        if (this.overlay) {
            if (this.overlayClickHandler) {
                this.overlay.removeEventListener('click', this.overlayClickHandler);
            }
            this.overlay.remove();
            this.overlay = null;
        }
        
        // Remove all event handlers
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.removeEventListener(eventName, this.preventDefaultsBound, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            document.removeEventListener(eventName, this.handleDragEnterBound, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            document.removeEventListener(eventName, this.handleDragLeaveBound, false);
        });

        document.removeEventListener('drop', this.handleDropBound, false);
    }
}