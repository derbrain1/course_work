import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class ConstructorComponent extends AbstractComponent {
  #exercises = [];
  #onCreate = null;
  #expandedExercises = new Set();

  constructor(exercises = []) {
    super();
    this.#exercises = exercises;
  }

  get template() {
    return `
      <section id="builder-section">
        <h2 class="section-title">Конструктор упражнений</h2>
        <div class="row">
          <div class="card">
            <h3>Создать упражнение</h3>
            <form id="create-exercise-form">
              <label>Название упражнения</label>
              <input id="exercise-name" placeholder="Напр. Жим гантелей на наклонной" required />
              
              <label>Мышечная группа</label>
              <select id="exercise-muscle" required>
                <option value="Грудь">Грудь</option>
                <option value="Спина">Спина</option>
                <option value="Ноги">Ноги</option>
                <option value="Плечи">Плечи</option>
                <option value="Бицепс">Бицепс</option>
                <option value="Трицепс">Трицепс</option>
              </select>
              
              <label>Оборудование</label>
              <select id="exercise-equipment" required>
                <option value="Штанга">Штанга</option>
                <option value="Гантели">Гантели</option>
                <option value="Тренажер">Тренажер</option>
                <option value="Собственный вес">Собственный вес</option>
              </select>
              
              <label>Техника/подсказки</label>
              <textarea id="exercise-technique" rows="4" placeholder="Амплитуда, темп, паузы, особенности техники..." required></textarea>
              
              <div style="margin-top:1rem;">
                <button type="submit" class="btn">Сохранить</button>
                <button type="button" class="btn btn-ghost" id="clear-form-btn">Очистить</button>
              </div>
            </form>
          </div>
          
          <div class="card">
            <h3>Справочник упражнений</h3>
            ${this.#renderExerciseList()}
          </div>
        </div>
      </section>`;
  }

  #renderExerciseList() {
    const muscleGroups = this.#groupExercisesByMuscleGroup();
    const groups = Object.keys(muscleGroups);
    
    if (groups.length === 0) {
      return '<p>Нет сохраненных упражнений</p>';
    }

    let html = '';
    
    groups.forEach(muscleGroup => {
      html += `<h4 style="margin-top: 1rem; color: #cfd6e6; font-weight: 500;">${muscleGroup}</h4>`;
      
      muscleGroups[muscleGroup].forEach(exercise => {
        const isExpanded = this.#expandedExercises.has(exercise.id);
        
        html += `
          <div class="exercise-item-container">
            <div class="rowline exercise-clickable" data-id="${exercise.id}" style="cursor: pointer; margin-bottom: ${isExpanded ? '8px' : '12px'};">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="toggle-icon" style="color: #6aa0ff; font-size: 14px;">${isExpanded ? '▼' : '▶'}</span>
                <div>${exercise.name}</div>
              </div>
              <div class="chip chip-${this.#getMuscleClass(exercise.muscle_group)}">${exercise.muscle_group}</div>
              <div class="chip">${exercise.equipment || 'Не указано'}</div>
            </div>
            
            ${isExpanded ? this.#renderExerciseDetails(exercise) : ''}
          </div>`;
      });
    });

    return html;
  }

  #renderExerciseDetails(exercise) {
    return `
      <div class="exercise-details-card" data-id="${exercise.id}" style="
        background: rgba(15, 19, 32, 0.8);
        border: 1px solid rgba(106, 160, 255, 0.2);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 12px;
        animation: fadeIn 0.3s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <h4 style="color: #6aa0ff; margin: 0; font-size: 1.2rem;">${exercise.name}</h4>
              
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div>
            <label style="color: #8a94a7; font-size: 12px; margin-bottom: 4px; display: block;">Мышечная группа:</label>
            <div><span class="chip chip-${this.#getMuscleClass(exercise.muscle_group)}">${exercise.muscle_group}</span></div>
          </div>
          <div>
            <label style="color: #8a94a7; font-size: 12px; margin-bottom: 4px; display: block;">Оборудование:</label>
            <div><span class="chip">${exercise.equipment || 'Не указано'}</span></div>
          </div>
        </div>
        
        <div>
          <label style="color: #8a94a7; font-size: 12px; margin-bottom: 8px; display: block;">Техника выполнения:</label>
          <div class="exercise-technique" style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 16px;
            line-height: 1.6;
            color: #e6e9ef;
            white-space: pre-line;
          ">
            ${this.#formatTechnique(exercise.technique)}
          </div>
        </div>
      </div>`;
  }

  #formatTechnique(technique) {
    if (!technique) return 'Не указано';
    
     
    const steps = technique.split(/\.\s+/).filter(step => step.trim().length > 0);
    
    if (steps.length === 0) return technique;
    
    
    if (technique.match(/^\d+\./)) {
      return technique.replace(/(\d+\.)/g, '<br>$1').replace(/^<br>/, '');
    }
    
   
    return steps.map((step, index) => {
      const trimmedStep = step.trim();
      return `${index + 1}. ${trimmedStep}${!trimmedStep.endsWith('.') ? '.' : ''}`;
    }).join('<br>');
  }

  #groupExercisesByMuscleGroup() {
    return this.#exercises.reduce((groups, exercise) => {
      const group = exercise.muscle_group;
      if (!groups[group]) groups[group] = [];
      groups[group].push(exercise);
      return groups;
    }, {});
  }

  #getMuscleClass(muscle) {
    const muscleClasses = {
      'Грудь': 'chest',
      'Спина': 'back',
      'Ноги': 'legs',
      'Плечи': 'shoulders',
      'Бицепс': 'biceps',
      'Трицепс': 'triceps'
    };
    return muscleClasses[muscle] || 'default';
  }

  bind() {
    const form = this.element.querySelector('#create-exercise-form');
    
    form.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      
      const exercise = {
        name: this.element.querySelector('#exercise-name').value.trim(),
        muscle_group: this.element.querySelector('#exercise-muscle').value,
        equipment: this.element.querySelector('#exercise-equipment').value,
        technique: this.element.querySelector('#exercise-technique').value.trim()
      };

      if (!exercise.name || !exercise.technique) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      if (this.#onCreate) {
        try {
          await this.#onCreate(exercise);
          form.reset();
          alert('Упражнение успешно сохранено!');
        } catch (err) {
          alert('Ошибка при сохранении упражнения');
        }
      }
    });

    this.element.querySelector('#clear-form-btn').addEventListener('click', () => {
      form.reset();
    });

    
    this.element.addEventListener('click', (evt) => {
      const clickable = evt.target.closest('.exercise-clickable');
      const closeBtn = evt.target.closest('.close-details-btn');
      
      if (clickable) {
        const id = clickable.dataset.id;
        
        if (this.#expandedExercises.has(id)) {
          this.#expandedExercises.delete(id);
        } else {
          this.#expandedExercises.add(id);
        }
        
        this.#updateRightCard();
      } 
      else if (closeBtn) {
        const id = closeBtn.dataset.id;
        this.#expandedExercises.delete(id);
        this.#updateRightCard();
      }
    });
  }

  #updateRightCard() {
    const rightCard = this.element.querySelector('.card:last-child');
    if (!rightCard) return;
    
    rightCard.innerHTML = `
      <h3>Справочник упражнений</h3>
      ${this.#renderExerciseList()}
    `;
  }

  setHandlers(onCreate) {
    this.#onCreate = onCreate;
  }
}
