import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class TrainingLogComponent extends AbstractComponent {
  #logs = [];
  #onCreate = null;
  #onUpdate = null;
  #onDelete = null;

  constructor(logs = []) {
    super();
    this.#logs = logs;
  }

  get template() {
    const logItems = this.#logs.map(log => 
      `<div class="rowline" data-id="${log.id}">
        <div>${this.#formatDate(log.data)}</div>
        <div>${log.name} <span class="chip chip-${this.#getMuscleClass(log.muscle)}">${log.muscle}</span></div>
        <div>${log.set}×${log.reps}×${log.weight} кг</div>
        <div class="log-actions">
          <button class="btn btn-ghost edit-log" data-id="${log.id}">✏️ Правка</button>
          <button class="btn btn-ghost delete-log" data-id="${log.id}">Удалить</button>
        </div>
      </div>`
    ).join('');

    return (`
      <section id="log-section">
        <h2 class="section-title">Журнал тренировок</h2>
        <div class="row">
          <div class="card">
            <h3>История тренировок</h3>
            ${logItems.length > 0 ? logItems : '<p>Нет записей о тренировках</p>'}
          </div>

          <div class="card">
            <h3>Новая запись</h3>
            <label>Дата</label>
            <input type="date" id="log-date" />
            <label>Упражнение</label>
            <input id="log-exercise" placeholder="Напр. Жим лежа" />
            <label>Мышечная группа</label>
            <select id="log-muscle">
              <option value="Грудь">Грудь</option>
              <option value="Спина">Спина</option>
              <option value="Ноги">Ноги</option>
              <option value="Плечи">Плечи</option>
              <option value="Бицепс">Бицепс</option>
              <option value="Трицепс">Трицепс</option>
            </select>
            <label>Подходы</label>
            <input type="number" id="log-sets" min="1" max="20" placeholder="4" />
            <label>Повторения</label>
            <input type="number" id="log-reps" min="1" max="50" placeholder="8" />
            <label>Вес (кг)</label>
            <input type="number" id="log-weight" min="0" max="500" step="0.5" placeholder="60" />
            <div style="margin-top:1rem;">
              <button class="btn" id="add-log-btn">Добавить</button>
              <button class="btn btn-ghost" id="reset-log-btn">Сбросить</button>
            </div>
          </div>
        </div>
      </section>`
    );
  }

  bind() {
    
    this.#setupNumberValidation();
    
    this.element.querySelector('#add-log-btn').addEventListener('click', async () => {
      
      const dateStr = this.element.querySelector('#log-date').value;
      const timestamp = dateStr ? Math.floor(new Date(dateStr).getTime() / 1000) : Math.floor(Date.now() / 1000);
      const log = {
        data: timestamp,
        name: this.element.querySelector('#log-exercise').value.trim(),
        muscle: this.element.querySelector('#log-muscle').value,
        set: Number(this.element.querySelector('#log-sets').value) || 0,
        reps: Number(this.element.querySelector('#log-reps').value) || 0,
        weight: Number(this.element.querySelector('#log-weight').value) || 0
      };

     

      if (!log.name) {
        
        alert('Пожалуйста, введите название упражнения');
        return;
      }

      if (this.#onCreate) {
        await this.#onCreate(log);
       
        this.element.querySelector('#log-date').value = '';
        this.element.querySelector('#log-exercise').value = '';
        this.element.querySelector('#log-sets').value = '';
        this.element.querySelector('#log-reps').value = '';
        this.element.querySelector('#log-weight').value = '';
      }
    });

   
    this.element.querySelector('#reset-log-btn').addEventListener('click', () => {

      this.element.querySelector('#log-date').value = '';
      this.element.querySelector('#log-exercise').value = '';
      this.element.querySelector('#log-sets').value = '';
      this.element.querySelector('#log-reps').value = '';
      this.element.querySelector('#log-weight').value = '';
    });


    this.element.addEventListener('click', async (evt) => {
      if (evt.target.classList.contains('edit-log')) {
        const id = evt.target.dataset.id;
        const log = this.#logs.find(l => String(l.id) === String(id));
        if (log && this.#onUpdate) {
          await this.#onUpdate(log);
        }
      } else if (evt.target.classList.contains('delete-log')) {
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
  }

  setHandlers(onCreate, onUpdate, onDelete) {
    this.#onCreate = onCreate;
    this.#onUpdate = onUpdate;
    this.#onDelete = onDelete;
  }

  #formatDate(timestamp) {
    
    const ts = Number(timestamp) || 0;
    const date = new Date(ts * 1000);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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

  
  update(logs) {
    this.#logs = logs;
    this.removeElement();
  }

  removeElement() {
    super.removeElement();
  }
}