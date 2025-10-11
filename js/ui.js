// ui.js - Presentation module (UI)

const icons = {
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
    arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
    rotateCw: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>',
    upload: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};

export class UIRenderer {
    constructor() {
        this.appElement = document.getElementById('app');
    }

    // Render home page
    renderHome(sets) {
        const setsHTML = sets.map(set => `
        <div class="card">
            <div class="card-header">
                <div style="flex: 1;">
                    <h3 class="card-title">${set.name}</h3>
                    <p class="card-subtitle">${set.cards.length} карток</p>
                    ${set.lastScore !== null ? `
                        <p class="card-score ${set.lastScore >= 70 ? 'improvement-positive' : set.lastScore >= 40 ? 'improvement-negative' : 'improvement-negative'}" style="margin-top: 0.25rem;">
                            Останній результат: ${set.lastScore}%
                        </p>
                    ` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-icon blue" data-action="export" data-id="${set.id}">
                        ${icons.upload}
                    </button>
                    <button class="btn-icon blue" data-action="edit" data-id="${set.id}">
                        ${icons.edit}
                    </button>
                    <button class="btn-icon red" data-action="delete" data-id="${set.id}">
                        ${icons.trash}
                    </button>
                </div>
            </div>
            <button class="btn btn-gradient" style="width: 100%;" data-action="play" data-id="${set.id}">
                ${icons.play}
                Почати гру
            </button>
        </div>
    `).join('');

        this.appElement.innerHTML = `
        <div class="gradient-bg-purple" style="min-height: 100vh;">
            <div class="container">
                <div class="header">
                    <h1 class="title">FlashMind</h1>
                    <p class="subtitle">Навчайся з картками легко та ефективно</p>
                </div>

                <div class="desktop-action-buttons" style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <button class="btn btn-primary" style="flex: 1; font-size: 1.125rem;" data-action="create">
                        ${icons.plus}
                        Створити новий набір
                    </button>
                    <button class="btn btn-primary" style="flex: 1; font-size: 1.125rem;" data-action="import">
                        ${icons.download}
                        Імпортувати у форматі json
                    </button>
                </div>

                <div>
                    ${setsHTML}
                </div>

                ${sets.length === 0 ? `
                    <div class="empty-state">
                        <p style="font-size: 1.25rem;">Немає наборів карток</p>
                        <p style="opacity: 0.8; margin-top: 0.5rem;">Створіть перший набір, щоб почати!</p>
                    </div>
                ` : ''}
            </div>

            <div class="mobile-action-buttons">
                <button class="btn btn-primary" data-action="create">
                    ${icons.plus}
                </button>
                <button class="btn btn-primary" data-action="import">
                    ${icons.download}
                </button>
            </div>
        </div>
    `;
    }

    // Render edit page
    renderEdit(editingSet) {
        const cardsHTML = editingSet.cards.map((card, index) => `
        <div class="card-edit-item">
            <div class="card-edit-header">
                <span class="card-edit-title">Картка ${index + 1}</span>
                ${editingSet.cards.length > 1 ? `
                    <button class="btn-icon red" data-action="delete-card" data-id="${card.id}">
                        ${icons.trash}
                    </button>
                ` : ''}
            </div>
            <input type="text" class="input" placeholder="Запитання" value="${card.question}" data-card-id="${card.id}" data-field="question" style="margin-bottom: 0.5rem;">
            <input type="text" class="input" placeholder="Відповідь" value="${card.answer}" data-card-id="${card.id}" data-field="answer">
        </div>
    `).join('');

        this.appElement.innerHTML = `
        <div class="gradient-bg-blue" style="min-height: 100vh;">
            <div class="container container-small">
                <button class="back-btn" data-action="back">
                    ${icons.arrowLeft}
                    Назад
                </button>

                <div class="card">
                    <h2 class="card-title" style="margin-bottom: 1rem;">
                        ${editingSet.id ? 'Редагувати набір' : 'Новий набір'}
                    </h2>

                    <input type="text" class="input input-lg" placeholder="Назва набору" value="${editingSet.name}" data-field="set-name" style="margin-bottom: 1rem;">

                    <div>
                        ${cardsHTML}
                    </div>

                    <button class="add-card-btn" data-action="add-card">
                        ${icons.plus}
                        Додати картку
                    </button>

                    <button class="btn btn-gradient edit-save-desktop" style="width: 100%; margin-top: 1.5rem;" data-action="save">
                        Зберегти набір
                    </button>
                </div>
            </div>

            <div class="edit-save-mobile">
                <button class="btn btn-gradient" style="width: 100%;" data-action="save">
                    Зберегти набір
                </button>
            </div>
        </div>
    `;
    }

    // Render game
    renderGame(gameState, selectedSet) {
        if (gameState.finished) {
            return this.renderGameFinished(gameState, selectedSet);
        }

        const currentCard = gameState.cards[gameState.currentIndex];
        const progress = ((gameState.currentIndex + 1) / gameState.cards.length) * 100;

        this.appElement.innerHTML = `
        <div class="gradient-bg-indigo" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem;">
            <div style="max-width: 672px; width: 100%;">
                <div class="game-header-mobile">
                    <div class="game-nav">
                        <button class="back-btn" data-action="exit" style="margin-bottom: 0;">
                            ${icons.arrowLeft}
                            Вихід
                        </button>
                        <span style="font-weight: 600; color: white;">
                            ${gameState.currentIndex + 1} / ${gameState.cards.length}
                        </span>
                    </div>

                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="game-content-mobile">
                    <div style="width: 100%;">
                        <div class="game-card">
                            <div style="text-align: center; flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                                ${!gameState.showAnswer ? `
                                    <p class="game-question-label">ЗАПИТАННЯ</p>
                                    <p class="game-question">${currentCard.question}</p>
                                ` : `
                                    <p class="game-question-label">ВІДПОВІДЬ</p>
                                    <p class="game-answer">${currentCard.answer}</p>
                                `}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="game-actions-mobile">
                    ${!gameState.showAnswer ? `
                        <div class="flex-row" style="width: 100%;">
                            <button class="btn btn-green flex-1" data-action="know">
                                ✓ Знаю
                            </button>
                            <button class="btn btn-red flex-1" data-action="dont-know">
                                ✗ Не знаю
                            </button>
                        </div>
                    ` : `
                        <button class="btn btn-gradient" style="width: 100%; font-size: 1.25rem; padding: 1.25rem;" data-action="next">
                            Далі →
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
    }

    // Render game finished
    renderGameFinished(gameState, selectedSet) {
        const previousScore = selectedSet.lastScore;
        const currentScore = gameState.finalScore;
        const improvement = previousScore !== null ? currentScore - previousScore : null;

        this.appElement.innerHTML = `
        <div class="gradient-bg-green" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem;">
            <div style="max-width: 672px; width: 100%;">
                <div class="result-content-mobile">
                    <div style="width: 100%;">
                        <div class="card result-card-mobile" style="padding: 2rem;">
                            <h2 style="font-size: 1.875rem; font-weight: bold; text-align: center; color: #1f2937; margin-bottom: 1.5rem;">Гра завершена!</h2>

                            <div style="text-align: center; margin-bottom: 1.5rem;">
                                <p class="result-score">${currentScore}%</p>
                                <p style="color: #6b7280; font-size: 1.125rem;">
                                    Правильно: ${gameState.correctCount} з ${gameState.cards.length}
                                </p>
                            </div>

                            <div class="result-bar">
                                <div class="result-bar-fill" style="width: ${currentScore}%"></div>
                            </div>

                            ${improvement !== null ? `
                                <div class="improvement">
                                    <p style="font-size: 1.125rem; color: #374151;">
                                        ${improvement > 0 ? `
                                            <span class="improvement-positive">↑ Покращення на ${improvement}%</span>
                                        ` : improvement < 0 ? `
                                            <span class="improvement-negative">↓ Зниження на ${Math.abs(improvement)}%</span>
                                        ` : `
                                            <span class="improvement-same">= Той самий результат</span>
                                        `}
                                    </p>
                                    <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
                                        Попередній результат: ${previousScore}%
                                    </p>
                                </div>
                            ` : ''}
                        </div>

                        <div class="flex-row result-actions-desktop" style="margin-top: 1.5rem;">
                            <button class="btn btn-gradient flex-1" data-action="restart">
                                ${icons.rotateCw}
                                Грати знову
                            </button>
                            <button class="btn btn-secondary flex-1" data-action="exit">
                                ${icons.arrowLeft}
                                На головну
                            </button>
                        </div>
                    </div>
                </div>

                <div class="result-actions-mobile">
                    <div class="flex-row">
                        <button class="btn btn-gradient flex-1" data-action="restart">
                            ${icons.rotateCw}
                            Грати знову
                        </button>
                        <button class="btn btn-secondary flex-1" data-action="exit">
                            ${icons.arrowLeft}
                            На головну
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}
