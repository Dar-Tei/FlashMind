// helpers.js - Helper functions for building error messages and hints

export class MessageHelper {
   // Tips for saving errors
   static getSaveErrorHelp(errorMessage) {
       if (errorMessage.includes('назву') || errorMessage.includes('назва')) {
           return {
               title: 'Щось не так',
               help: `
                   <div class="error-help">
                       <p><strong>Підказка:</strong></p>
                       <ul>
                           <li>Введіть назву набору у верхньому полі</li>
                           <li>Назва має бути зрозумілою (наприклад: "Англійські слова", "Столиці Європи")</li>
                           <li>Уникайте занадто коротких назв</li>
                       </ul>
                   </div>
               `
           };
       } else if (errorMessage.includes('картк')) {
           return {
               title: 'Щось не так',
               help: `
                   <div class="error-help">
                       <p><strong>Підказка:</strong></p>
                       <ul>
                           <li>Додайте хоча б одну картку, натиснувши "Додати картку"</li>
                           <li>Заповніть обидва поля картки: питання та відповідь</li>
                           <li>Питання має бути чітким та зрозумілим</li>
                           <li>Відповідь має бути короткою та точною</li>
                       </ul>
                       <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                           <strong>Приклад:</strong><br>
                           Питання: "Столиця Франції"<br>
                           Відповідь: "Париж"
                       </p>
                   </div>
               `
           };
       }
       return { title: 'Помилка збереження', help: '' };
   }

   // Tips for import errors
   static getImportErrorHelp(errorMessage) {
       if (errorMessage.includes('формат')) {
           return {
               title: 'Невірний формат файлу',
               help: `
                   <div class="error-help">
                       <p><strong>Очікуваний формат JSON:</strong></p>
                       <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-size: 0.875rem; margin: 0.5rem 0;">
{
 "name": "Назва набору",
 "cards": [
   {
     "question": "Питання 1",
     "answer": "Відповідь 1"
   },
   {
     "question": "Питання 2",
     "answer": "Відповідь 2"
   }
 ]
}</pre>
                       <p><strong>Перевірте:</strong></p>
                       <ul>
                           <li>Файл має містити поле "name" (назва набору)</li>
                           <li>Файл має містити масив "cards" з картками</li>
                           <li>Кожна картка має мати "question" та "answer"</li>
                           <li>Всі лапки та коми мають бути на місці</li>
                       </ul>
                   </div>
               `
           };
       } else if (errorMessage.includes('валідних карток') || errorMessage.includes('немає')) {
           return {
               title: 'Файл не містить валідних карток',
               help: `
                   <div class="error-help">
                       <p><strong>Проблема:</strong> У файлі відсутні правильно оформлені картки</p>
                       <p><strong>Можливі причини:</strong></p>
                       <ul>
                           <li>Масив "cards" порожній</li>
                           <li>У картках відсутні поля "question" або "answer"</li>
                           <li>Поля заповнені некоректно (не текст)</li>
                           <li>Поля пусті або містять тільки пробіли</li>
                       </ul>
                       <p style="margin-top: 1rem;"><strong>Приклад правильної картки:</strong></p>
                       <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 0.875rem; margin: 0.5rem 0;">
{
 "question": "Столиця України",
 "answer": "Київ"
}</pre>
                       <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                           <strong>Порада:</strong> Експортуйте існуючий набір, щоб побачити правильний формат
                       </p>
                   </div>
               `
           };
       } else if (errorMessage.includes('JSON')) {
           return {
               title: 'Помилка читання JSON',
               help: `
                   <div class="error-help">
                       <p><strong>Файл не є валідним JSON</strong></p>
                       <p><strong>Що перевірити:</strong></p>
                       <ul>
                           <li>Файл має розширення .json</li>
                           <li>Файл не пошкоджений</li>
                           <li>Всі фігурні дужки { } відкриті та закриті</li>
                           <li>Всі квадратні дужки [ ] відкриті та закриті</li>
                           <li>Після кожного елемента стоїть кома (крім останнього)</li>
                           <li>Всі рядки в подвійних лапках " "</li>
                       </ul>
                       <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                           <strong>Порада:</strong> Використовуйте онлайн валідатор JSON (наприклад, jsonlint.com) для перевірки файлу
                       </p>
                       <p style="margin-top: 1rem;"><strong>Типові помилки:</strong></p>
                       <ul style="font-size: 0.875rem;">
                           <li>Зайва кома після останнього елемента</li>
                           <li>Відсутність коми між елементами</li>
                           <li>Одинарні лапки замість подвійних</li>
                           <li>Незакриті дужки</li>
                       </ul>
                   </div>
               `
           };
       }
       
       return {
           title: 'Помилка імпорту',
           help: `
               <div class="error-help">
                   <p><strong>Загальні рекомендації:</strong></p>
                   <ul>
                       <li>Переконайтесь, що вибрано правильний файл</li>
                       <li>Файл має бути у форматі .json</li>
                       <li>Спробуйте експортувати набір та порівняти формат</li>
                       <li>Перевірте файл на наявність помилок</li>
                   </ul>
                   <p style="margin-top: 1rem; padding: 1rem; background: #eff6ff; border-radius: 0.5rem; font-size: 0.875rem;">
                       <strong>Як створити правильний JSON файл:</strong><br>
                       1. Створіть набір в додатку<br>
                       2. Експортуйте його<br>
                       3. Використовуйте цей файл як шаблон
                   </p>
                   <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                       Деталі помилки: ${errorMessage}
                   </p>
               </div>
           `
       };
   }

   // Tips for Drag & Drop errors
   static getDragDropErrorHelp(errorMessage) {
       if (errorMessage.includes('JSON файл')) {
           return {
               title: 'Невірний тип файлу',
               help: `
                   <div class="error-help">
                       <p><strong>Перетягніть файл з розширенням .json</strong></p>
                       <ul>
                           <li>Підтримуються тільки JSON файли</li>
                           <li>Файл має мати розширення .json</li>
                           <li>Інші формати (txt, docx, xlsx) не підтримуються</li>
                       </ul>
                       <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                           <strong>Порада:</strong> Експортуйте набір з додатку, щоб отримати файл правильного формату
                       </p>
                   </div>
               `
           };
       } else if (errorMessage.includes('формат')) {
           return {
               title: 'Невірна структура файлу',
               help: `
                   <div class="error-help">
                       <p><strong>JSON файл має невірну структуру</strong></p>
                       <p><strong>Правильний формат:</strong></p>
                       <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-size: 0.875rem; margin: 0.5rem 0;">
{
 "name": "Назва набору",
 "cards": [
   {
     "question": "Питання",
     "answer": "Відповідь"
   }
 ]
}</pre>
                       <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                           Перетягніть файл, експортований з FlashMind
                       </p>
                   </div>
               `
           };
       } else if (errorMessage.includes('валідних карток')) {
           return {
               title: 'Немає валідних карток',
               help: `
                   <div class="error-help">
                       <p><strong>Файл не містить правильно оформлених карток</strong></p>
                       <ul>
                           <li>Переконайтесь, що масив "cards" не порожній</li>
                           <li>Кожна картка має містити "question" та "answer"</li>
                           <li>Поля не можуть бути пустими</li>
                       </ul>
                       <p style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border-radius: 0.5rem; font-size: 0.875rem;">
                           Перевірте, чи правильно заповнені всі картки у файлі
                       </p>
                   </div>
               `
           };
       } else if (errorMessage.includes('читання')) {
           return {
               title: 'Помилка читання файлу',
               help: `
                   <div class="error-help">
                       <p><strong>Не вдалося прочитати файл</strong></p>
                       <ul>
                           <li>Файл може бути пошкодженим</li>
                           <li>JSON містить синтаксичні помилки</li>
                           <li>Перевірте файл у текстовому редакторі</li>
                       </ul>
                       <p style="margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                           <strong>Рекомендація:</strong> Використайте JSON валідатор (jsonlint.com) для перевірки файлу
                       </p>
                   </div>
               `
           };
       }
       
       return {
           title: 'Помилка імпорту',
           help: `
               <div class="error-help">
                   <p><strong>Щось пішло не так</strong></p>
                   <p style="margin-top: 0.5rem;">Деталі: ${errorMessage}</p>
                   <p style="margin-top: 1rem;"><strong>Що спробувати:</strong></p>
                   <ul>
                       <li>Перевірте, що файл не пошкоджений</li>
                       <li>Спробуйте імпортувати через кнопку "Імпортувати"</li>
                       <li>Експортуйте набір та порівняйте формат</li>
                   </ul>
               </div>
           `
       };
   }

   // Tips for AI generation errors
   static getAIErrorHelp(error) {
       if (error.message.includes('API key')) {
           return {
               title: 'Помилка API ключа',
               help: `
                   <div class="error-help">
                       <p><strong>Можливі причини:</strong></p>
                       <ul>
                           <li>API ключ недійсний або застарілий</li>
                           <li>Перевірте правильність введення ключа</li>
                           <li>Переконайтесь, що ключ активний</li>
                       </ul>
                   </div>
               `
           };
       } else if (error.message.includes('quota') || error.message.includes('429')) {
           return {
               title: 'Перевищено ліміт запитів',
               help: `
                   <div class="error-help">
                       <p><strong>Що робити:</strong></p>
                       <ul>
                           <li>Зачекайте кілька хвилин та спробуйте знову</li>
                           <li>Перевірте ліміти вашого API ключа</li>
                           <li>Спробуйте згенерувати меншу кількість карток</li>
                       </ul>
                   </div>
               `
           };
       } else if (error.message.includes('network') || error.message.includes('fetch')) {
           return {
               title: "Помилка з'єднання",
               help: `
                   <div class="error-help">
                       <p><strong>Перевірте:</strong></p>
                       <ul>
                           <li>Підключення до інтернету</li>
                           <li>Налаштування брандмауера/антивірусу</li>
                           <li>Спробуйте оновити сторінку</li>
                       </ul>
                   </div>
               `
           };
       }
       
       return {
           title: 'Не вдалося згенерувати картки',
           help: `
               <div class="error-help">
                   <p><strong>Рекомендації:</strong></p>
                   <ul>
                       <li>Спробуйте більш конкретну тему</li>
                       <li>Зменшіть кількість карток</li>
                       <li>Спробуйте інший рівень складності</li>
                       <li>Перезавантажте сторінку та спробуйте знову</li>
                   </ul>
                   <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
                       Деталі помилки: ${error.message}
                   </p>
               </div>
           `
       };
   }

   // Successful message for import via Drag & Drop
   static getDragDropSuccessMessage(setName, cardsCount) {
       return `
           <p>Набір "${setName}" успішно імпортовано!</p>
           <div style="margin-top: 1rem; padding: 1rem; background: #d1fae5; border-radius: 0.5rem; font-size: 0.875rem;">
               Імпортовано ${cardsCount} карток
           </div>
       `;
   }
}