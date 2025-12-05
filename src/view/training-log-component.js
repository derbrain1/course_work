import { AbstractComponent } from '../framework/view/abstract-component.js';
import { render } from '../framework/render.js';
import LogElementComponent from './log-element-component.js';

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
    return `
      <section id="log-section">
        <h2 class="section-title">Журнал тренировок</h2>
        <div class="row">
          <div class="card">
            <h3>История тренировок</h3>
            <div id="log-container"></div>
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
      </section>
    `;
  }

  bind() {
    this.#renderLogs();
    
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
        this.#clearForm();
      }
    });

    this.element.querySelector('#reset-log-btn').addEventListener('click', () => {
      this.#clearForm();
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

  #renderLogs() {
    const container = this.element.querySelector('#log-container');
    container.innerHTML = '';
    
    if (this.#logs.length === 0) {
      container.innerHTML = '<p>Нет записей о тренировках</p>';
      return;
    }
    
    this.#logs.forEach(log => {
      const logElement = new LogElementComponent(log);
      render(logElement, container);
    });
  }

  #clearForm() {
    this.element.querySelector('#log-date').value = '';
    this.element.querySelector('#log-exercise').value = '';
    this.element.querySelector('#log-sets').value = '';
    this.element.querySelector('#log-reps').value = '';
    this.element.querySelector('#log-weight').value = '';
  }

  setHandlers(onCreate, onUpdate, onDelete) {
    this.#onCreate = onCreate;
    this.#onUpdate = onUpdate;
    this.#onDelete = onDelete;
  }

  update(logs) {
    this.#logs = logs;
    this.#renderLogs();
  }
}