// ai.js - AI generation module using Gemini API

export class AIGenerator {
    constructor() {
        this.model = 'gemini-2.0-flash-exp';
    }
 
    // Set model
    setModel(model) {
        this.model = model;
    }
 
    // Generate flashcards
    async generateCards(options) {
        const {
            topic,
            count = 10,
            level = 'середній',
            questionLang = 'українська',
            answerLang = 'українська'
        } = options;
 
        const prompt = this.buildPrompt(topic, count, level, questionLang, answerLang);
 
        try {
            // We use Workers CORS Proxy WITHOUT an API key in the URL
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
            
            const response = await fetch('https://delicate-bird-b11f.alexeyz55555.workers.dev/?quest=' + 
                encodeURIComponent(apiUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                    }
                })
            });
 
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error('Помилка API: ' + response.status);
            }
 
            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0]) {
                throw new Error('Невірна відповідь від API');
            }
 
            const generatedText = data.candidates[0].content.parts[0].text;
            
            return this.parseResponse(generatedText);
        } catch (error) {
            console.error('AI Generation Error:', error);
            throw error;
        }
    }
 
    // Build prompt for AI
    buildPrompt(topic, count, level, questionLang, answerLang) {
        return `Ти - асистент для створення навчальних флеш-карток.
 
 Твоє завдання: згенерувати ${count} флеш-карток на тему: "${topic}"
 
 Параметри:
 - Рівень складності: ${level}
 - Мова питань: ${questionLang}
 - Мова відповідей: ${answerLang}
 
 ВАЖЛИВІ ПРАВИЛА:
 1. Питання мають бути чіткими та конкретними
 2. Відповіді мають бути короткими та точними (1-3 слова або коротке речення)
 3. Уникай дублювання питань
 4. Питання мають відповідати рівню складності
 5. Обов'язково використовуй вказані мови
 6. Для мовних карток: питання - слово/фраза, відповідь - переклад
 7. Для фактологічних карток: питання - що? хто? де? коли?, відповідь - факт
 
 Поверни ТІЛЬКИ JSON без будь-якого іншого тексту:
 {
  "cards": [
    {"question": "питання 1", "answer": "відповідь 1"},
    {"question": "питання 2", "answer": "відповідь 2"}
  ]
 }`;
    }
 
    // Parse AI response
    parseResponse(text) {
        try {
            // Remove markdown code blocks if present
            let cleanText = text.trim();
            cleanText = cleanText.replace(/```json\n?/g, '');
            cleanText = cleanText.replace(/```\n?/g, '');
            cleanText = cleanText.trim();
 
            const data = JSON.parse(cleanText);
 
            if (!data.cards || !Array.isArray(data.cards)) {
                throw new Error('Невірний формат відповіді');
            }
 
            // Validate cards
            const validCards = data.cards.filter(card => 
                card.question && 
                card.answer && 
                typeof card.question === 'string' && 
                typeof card.answer === 'string' &&
                card.question.trim() !== '' &&
                card.answer.trim() !== ''
            );
 
            if (validCards.length === 0) {
                throw new Error('Не вдалося згенерувати валідні картки');
            }
 
            return {
                success: true,
                cards: validCards
            };
        } catch (error) {
            console.error('Parse error:', error);
            console.log('Raw text:', text);
            return {
                success: false,
                error: 'Помилка обробки відповіді AI'
            };
        }
    }
 }