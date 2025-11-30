import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class TrainigPlanComponent extends AbstractComponent {
  #plans = [];
  #onCreate = null;
  #onUpdate = null;
  #onDelete = null;

  constructor(plans = []) {
    super();
    this.#plans = plans;
  }

  get template() {
    
    const groupedPlans = this.#groupPlansByDay(this.#plans);
    const dayOrder = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

    const planDays = Object.entries(groupedPlans)
      .sort(([dayA], [dayB]) => dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB))
      .map(([dayName, exercises]) => `
      <div class="day-section">
        <h4>${dayName}</h4>
        ${exercises.map(exercise => `
          <div class="exercise-details" data-id="${exercise.id}">
            <div class="exercise-info">
              <div class="exercise-name">${exercise.exercise}</div>
              <div class="exercise-muscles">
                <span class="chip chip-${this.#getMuscleClass(exercise.muscle)}">${exercise.muscle}</span>
              </div>
            </div>
            <div class="sets-reps">${exercise.set} подхода × ${exercise.reps} повторений</div>
            <div class="exercise-actions">
              <button class="btn btn-ghost edit-plan" data-id="${exercise.id}">Редактировать</button>
              <button class="btn btn-ghost delete-plan" data-id="${exercise.id}">Удалить</button>
            </div>
          </div>
        `).join('')}
      </div>`).join('');

    return `
      <section id="plan-section">
        <h2 class="section-title">План тренировок</h2>
        <div class="row">
          <div class="card">
            <h3>План недели</h3>
            ${planDays.length ? planDays : '<p>Нет тренировок</p>'}
          </div>

          <div class="card">
            <h3>Добавить упражнение</h3>

            <label>День недели</label>
            <select id="plan-day">
              <option>Понедельник</option>
              <option>Вторник</option>
              <option>Среда</option>
              <option>Четверг</option>
              <option>Пятница</option>
              <option>Суббота</option>
              <option>Воскресенье</option>
            </select>

            <label>Упражнения с мышцами</label>

            <div id="exercises-list">
              <!-- Шаблон одного упражнения -->
              <div class="exercise-item">
                <div class="exercise-header">
                  <span class="exercise-number">Упражнение 1</span>
                  <button class="remove-exercise" type="button">Удалить</button>
                </div>
                <input class="ex-name" placeholder="Название упражнения" />
                <label>Мышечная группа</label>
                <select class="ex-muscle" data-muscle="Грудь">
                  <option value="Грудь">Грудь</option>
                  <option value="Спина">Спина</option>
                  <option value="Ноги">Ноги</option>
                  <option value="Плечи">Плечи</option>
                  <option value="Бицепс">Бицепс</option>
                  <option value="Трицепс">Трицепс</option>
                </select>
                <label>Подходы</label>
                <input class="ex-set" type="number" min="1" max="20" placeholder="4" />
                <label>Повторения</label>
                <input class="ex-reps" type="text" placeholder="8-12" pattern="[0-9\\-]+" title="Только цифры и дефис (например: 8-12)" />
              </div>
            </div>

            <button class="btn btn-ghost" id="add-exercise-btn" type="button">Добавить упражнение</button>

            <div style="margin-top:1rem;">
              <button class="btn" id="save-plan-btn">Сохранить упражнения</button>
              <button class="btn btn-ghost" id="clear-plan-btn">Очистить</button>
            </div>
          </div>
        </div>
      </section>`
    ;
  }

  bind() {
    this.#setupNumberValidation();
    
    const addBtn = this.element.querySelector('#add-exercise-btn');
    addBtn.addEventListener('click', () => {
      this.#addExerciseBlock();
    });

    this.element.querySelector('#exercises-list').addEventListener('click', (evt) => {
      if (evt.target.classList.contains('remove-exercise')) {
        const block = evt.target.closest('.exercise-item');
        block.remove();
        this.#reindexExercises();
      }
    });

  
    this.element.querySelector('#save-plan-btn').addEventListener('click', async () => {
      const day = this.element.querySelector('#plan-day').value;
      const exerciseBlocks = [...this.element.querySelectorAll('.exercise-item')];

      const exercises = exerciseBlocks.map((b) => ({
        day,
        exercise: b.querySelector('.ex-name').value.trim(),
        muscle: b.querySelector('.ex-muscle').value,
        set: Number(b.querySelector('.ex-set').value) || 0,
        reps: b.querySelector('.ex-reps').value.trim()
      })).filter(e => e.exercise);  


      if (this.#onCreate && exercises.length > 0) {
        await this.#onCreate(exercises);
    
        const list = this.element.querySelector('#exercises-list');
        list.innerHTML = '';
        this.#addExerciseBlock(); 
      }
    });

    
    this.element.querySelector('#clear-plan-btn').addEventListener('click', () => {
      const list = this.element.querySelector('#exercises-list');
      list.innerHTML = '';
      this.#addExerciseBlock();
    });

    
    this.element.addEventListener('click', async (evt) => {
      if (evt.target.classList.contains('edit-plan')) {
        
        const id = evt.target.dataset.id;
        const plan = this.#plans.find(p => String(p.id) === String(id));
        if (plan && this.#onUpdate) {
          await this.#onUpdate(plan);
        }
      } else if (evt.target.classList.contains('delete-plan')) {
        const id = evt.target.dataset.id;
        if (this.#onDelete) {
          await this.#onDelete(id);
        }
      }
    });
  }

 
  #setupNumberValidation() {
    
    const numberInputs = this.element.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
      input.addEventListener('input', (evt) => {
        const value = evt.target.value;
        
        if (!/^\d*$/.test(value)) {
          evt.target.value = value.slice(0, -1);
        }
      });
    });


    const repsInputs = this.element.querySelectorAll('input.ex-reps');
    repsInputs.forEach(input => {
      input.addEventListener('input', (evt) => {
        const value = evt.target.value;
        
        if (!/^[0-9\\-]*$/.test(value)) {
          evt.target.value = value.slice(0, -1);
        }
      });
    });
  }

  
  setHandlers(onCreate, onUpdate, onDelete) {
    this.#onCreate = onCreate;
    this.#onUpdate = onUpdate;
    this.#onDelete = onDelete;
  }

 
  #addExerciseBlock() {
    const list = this.element.querySelector('#exercises-list');
    const count = list.querySelectorAll('.exercise-item').length + 1;
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-item';
    wrapper.innerHTML = `
      <div class="exercise-header">
        <span class="exercise-number">Упражнение ${count}</span>
        <button class="remove-exercise" type="button">Удалить</button>
      </div>
      <input class="ex-name" placeholder="Название упражнения" />
      <label>Мышечная группа</label>
      <select class="ex-muscle">
        <option value="Грудь">Грудь</option>
        <option value="Спина">Спина</option>
        <option value="Ноги">Ноги</option>
        <option value="Плечи">Плечи</option>
        <option value="Бицепс">Бицепс</option>
        <option value="Трицепс">Трицепс</option>
      </select>
      <label>Подходы</label>
      <input class="ex-set" type="number" min="1" max="20" placeholder="4" />
      <label>Повторения</label>
      <input class="ex-reps" type="text" placeholder="8-12" pattern="[0-9\\-]+" title="Только цифры и дефис (например: 8-12)" />
    `;
    list.appendChild(wrapper);
  }

  #reindexExercises() {
    const nodes = this.element.querySelectorAll('.exercise-item');
    nodes.forEach((n, idx) => {
      const num = n.querySelector('.exercise-number');
      if (num) num.textContent = `Упражнение ${idx + 1}`;
    });
  }

 
  #groupPlansByDay(plans) {
    return plans.reduce((grouped, plan) => {
      const dayName = plan.day || 'Не указан';
      if (!grouped[dayName]) grouped[dayName] = [];
      grouped[dayName].push(plan);
      return grouped;
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

  update(plans) {
    this.#plans = plans;
    this.removeElement();
  }


  removeElement() {
    super.removeElement();
  }
}