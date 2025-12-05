import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class LogElementComponent extends AbstractComponent {
  #log = null;

  constructor(log) {
    super();
    this.#log = log;
  }

  get template() {
    return `
      <div class="rowline" data-id="${this.#log.id}">
        <div>${this.#formatDate(this.#log.data)}</div>
        <div>
          ${this.#log.name} 
          <span class="chip chip-${this.#getMuscleClass(this.#log.muscle)}">
            ${this.#log.muscle}
          </span>
        </div>
        <div>${this.#log.set}×${this.#log.reps}×${this.#log.weight} кг</div>
        <div class="log-actions">
          <button class="btn btn-ghost edit-log" data-id="${this.#log.id}">Правка</button>
          <button class="btn btn-ghost delete-log" data-id="${this.#log.id}">Удалить</button>
        </div>
      </div>
    `;
  }

  #formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  #getMuscleClass(muscle) {
    const classes = {
      'Грудь': 'chest',
      'Спина': 'back',
      'Ноги': 'legs',
      'Плечи': 'shoulders',
      'Бицепс': 'biceps',
      'Трицепс': 'triceps'
    };
    return classes[muscle] || 'default';
  }
}