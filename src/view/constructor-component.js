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
              
              <div class="form-buttons">
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
      html += `<h4 class="muscle-group-title">${muscleGroup}</h4>`;
      
      muscleGroups[muscleGroup].forEach(exercise => {
        const isExpanded = this.#expandedExercises.has(exercise.id);
        
        html += `
          <div class="exercise-item-container">
            <div class="rowline exercise-clickable ${isExpanded ? 'expanded' : ''}" data-id="${exercise.id}">
              <div class="exercise-clickable-header">
                <span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>
                <div class="exercise-name">${exercise.name}</div>
              </div>
              <div class="chip chip-${this.#getMuscleClass(exercise.muscle_group)}">${exercise.muscle_group}</div>
              <div class="chip equipment-chip">${exercise.equipment || 'Не указано'}</div>
            </div>
            
            ${isExpanded ? this.#renderExerciseDetails(exercise) : ''}
          </div>`;
      });
    });

    return html;
  }

  #renderExerciseDetails(exercise) {
    return `
      <div class="exercise-details-card" data-id="${exercise.id}">
        <div class="exercise-details-header">
          <h4 class="exercise-details-title">${exercise.name}</h4>
        </div>
        
        <div class="exercise-details-grid">
          <div class="exercise-detail-item">
            <label class="exercise-detail-label">Мышечная группа:</label>
            <div><span class="chip chip-${this.#getMuscleClass(exercise.muscle_group)}">${exercise.muscle_group}</span></div>
          </div>
          <div class="exercise-detail-item">
            <label class="exercise-detail-label">Оборудование:</label>
            <div><span class="chip equipment-chip">${exercise.equipment || 'Не указано'}</span></div>
          </div>
        </div>
        
        <div class="exercise-technique-section">
          <label class="exercise-detail-label">Техника выполнения:</label>
          <div class="exercise-technique-content">
            ${this.#formatTechnique(exercise.technique)}
          </div>
        </div>
      </div>`;
  }

  #formatTechnique(technique) {
    if (!technique) return 'Не указано';
    
    if (technique.includes('\n')) {
      return technique.replace(/\n/g, '<br>');
    }
    return technique;
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
      
      if (clickable) {
        const id = clickable.dataset.id;
        
        if (this.#expandedExercises.has(id)) {
          this.#expandedExercises.delete(id);
        } else {
          this.#expandedExercises.add(id);
        }
        
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