import {render} from '../framework/render.js';
import BoardComponent from '../view/board-component.js';
import TrainingLogComponent from '../view/training-log-component.js';
import StatisticsComponent from '../view/statistics-component.js';
import ConstructorComponent from '../view/constructor-component.js';
import TrainigPlanComponent from '../view/training-plan-component.js';

export default class BoardPresenter {
  #boardContainer = null;
  #boardComponent = new BoardComponent();
  #planModel = null;
  #logModel = null;
  #currentView = null;

  constructor(boardContainer, planModel, logModel) {
    this.#boardContainer = boardContainer;
    this.#planModel = planModel;
    this.#logModel = logModel;

    this.#planModel.addObserver((updateType) => {
      if (this.#currentView === 'plan') {
        this.showPlan();
      }
    });

    this.#logModel.addObserver((updateType) => {
      if (this.#currentView === 'log') {
        this.showLog();
      }
    });
  }

  init() {
    render(this.#boardComponent, this.#boardContainer);
    this.showPlan(); 
  }

  showPlan() {

    this.#currentView = 'plan';
    this.#clearBoard();
    this.#renderPlanView();
  }

  showLog() {

    this.#currentView = 'log';
    this.#clearBoard();
    this.#renderLogView();
  }

  showStats() {
    this.#currentView = 'stats';
    this.#clearBoard();
    this.#renderStatsView();
  }

  showConstructor() {
    this.#currentView = 'constructor';
    this.#clearBoard();
    this.#renderConstructorView();
  }

  get currentView() {
    return this.#currentView;
  }

  #clearBoard() {
    this.#boardComponent.element.innerHTML = '';
  }

  #renderPlanView() {

   
    const view = new TrainigPlanComponent(this.#planModel.plans);

 
    view.setHandlers(
      async (exercises) => {

        
        for (const ex of exercises) {
          try {
            
            await this.#planModel.addPlan({
              day: ex.day,
              exercise: ex.exercise,
              muscle: ex.muscle,
              set: ex.set,
              reps: ex.reps
            });

          } catch (err) {

          }
        }
      },


      async (plan) => {
    
        
    
        const updatedPlan = await this.#showEditPlanModal(plan);
        if (updatedPlan) {
          try {
            await this.#planModel.updatePlan(updatedPlan);
          } catch (err) {
          }
        }
      },

      
      async (id) => {
        const confirmed = confirm('Вы уверены, что хотите удалить это упражнение?');
        if (confirmed) {
          try {
            await this.#planModel.deletePlan(id);
          } catch (err) {
          }
        }
      }
    );

    render(view, this.#boardComponent.element);
    view.bind(); 
  }

  #renderLogView() {
    
    const view = new TrainingLogComponent(this.#logModel.logs);

    view.setHandlers(
    
      async (entry) => {
        try {
          await this.#logModel.addLog(entry);
        } catch (err) {
        }
      },

    
      async (entry) => {
        
        const updatedEntry = await this.#showEditLogModal(entry);
        if (updatedEntry) {
          try {
            await this.#logModel.updateLog(updatedEntry);
          } catch (err) {
          }
        }
      },

      
      async (id) => {
        
        const confirmed = confirm('Вы уверены, что хотите удалить эту запись?');
        if (confirmed) {
          try {
            await this.#logModel.deleteLog(id);
           
          } catch (err) {
           
          }
        }
      }
    );

    render(view, this.#boardComponent.element);
    view.bind(); 
  }

  #renderStatsView() {
    
    const view = new StatisticsComponent();
    render(view, this.#boardComponent.element);
    
  }

  #renderConstructorView() {
    const view = new ConstructorComponent();
    render(view, this.#boardComponent.element);
    
  }

  
  #showEditPlanModal(plan) {
    return new Promise((resolve) => {
      
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h3>Редактировать упражнение</h3>
          <form id="edit-plan-form">
            <label>День недели</label>
            <select id="edit-plan-day">
              <option value="Понедельник" ${plan.day === 'Понедельник' ? 'selected' : ''}>Понедельник</option>
              <option value="Вторник" ${plan.day === 'Вторник' ? 'selected' : ''}>Вторник</option>
              <option value="Среда" ${plan.day === 'Среда' ? 'selected' : ''}>Среда</option>
              <option value="Четверг" ${plan.day === 'Четверг' ? 'selected' : ''}>Четверг</option>
              <option value="Пятница" ${plan.day === 'Пятница' ? 'selected' : ''}>Пятница</option>
              <option value="Суббота" ${plan.day === 'Суббота' ? 'selected' : ''}>Суббота</option>
              <option value="Воскресенье" ${plan.day === 'Воскресенье' ? 'selected' : ''}>Воскресенье</option>
            </select>

            <label>Упражнение</label>
            <input id="edit-plan-exercise" value="${plan.exercise || ''}" placeholder="Название упражнения" />

            <label>Мышечная группа</label>
            <select id="edit-plan-muscle">
              <option value="Грудь" ${plan.muscle === 'Грудь' ? 'selected' : ''}>Грудь</option>
              <option value="Спина" ${plan.muscle === 'Спина' ? 'selected' : ''}>Спина</option>
              <option value="Ноги" ${plan.muscle === 'Ноги' ? 'selected' : ''}>Ноги</option>
              <option value="Плечи" ${plan.muscle === 'Плечи' ? 'selected' : ''}>Плечи</option>
              <option value="Бицепс" ${plan.muscle === 'Бицепс' ? 'selected' : ''}>Бицепс</option>
              <option value="Трицепс" ${plan.muscle === 'Трицепс' ? 'selected' : ''}>Трицепс</option>
            </select>

            <label>Подходы</label>
            <input id="edit-plan-set" type="number" min="1" max="20" value="${plan.set || ''}" placeholder="4" />

            <label>Повторения</label>
            <input id="edit-plan-reps" type="text" value="${plan.reps || ''}" placeholder="8-12" pattern="[0-9\\-]+" title="Только цифры и дефис (например: 8-12)" />

            <div style="margin-top:1rem;">
              <button type="submit" class="btn">Сохранить</button>
              <button type="button" class="btn btn-ghost" id="cancel-edit-btn">Отмена</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modal);

      
      const repsInput = modal.querySelector('#edit-plan-reps');
      repsInput.addEventListener('input', (evt) => {
        const value = evt.target.value;
       
        if (!/^[0-9\\-]*$/.test(value)) {
          evt.target.value = value.slice(0, -1);
        }
      });

      const form = modal.querySelector('#edit-plan-form');
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        
        const updatedPlan = {
          ...plan,
          day: modal.querySelector('#edit-plan-day').value,
          exercise: modal.querySelector('#edit-plan-exercise').value.trim(),
          muscle: modal.querySelector('#edit-plan-muscle').value,
          set: Number(modal.querySelector('#edit-plan-set').value) || 0,
          reps: modal.querySelector('#edit-plan-reps').value.trim()
        };

        document.body.removeChild(modal);
        resolve(updatedPlan);
      });

    
      const cancelBtn = modal.querySelector('#cancel-edit-btn');
      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(null);
      });

      modal.addEventListener('click', (evt) => {
        if (evt.target === modal) {
          document.body.removeChild(modal);
          resolve(null);
        }
      });
    });
  }


  #showEditLogModal(log) {
    return new Promise((resolve) => {
      const date = new Date(log.data * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h3>Редактировать запись</h3>
          <form id="edit-log-form">
            <label>Дата</label>
            <input type="date" id="edit-log-date" value="${dateStr}" />

            <label>Упражнение</label>
            <input id="edit-log-exercise" value="${log.name || ''}" placeholder="Напр. Жим лежа" />

            <label>Мышечная группа</label>
            <select id="edit-log-muscle">
              <option value="Грудь" ${log.muscle === 'Грудь' ? 'selected' : ''}>Грудь</option>
              <option value="Спина" ${log.muscle === 'Спина' ? 'selected' : ''}>Спина</option>
              <option value="Ноги" ${log.muscle === 'Ноги' ? 'selected' : ''}>Ноги</option>
              <option value="Плечи" ${log.muscle === 'Плечи' ? 'selected' : ''}>Плечи</option>
              <option value="Бицепс" ${log.muscle === 'Бицепс' ? 'selected' : ''}>Бицепс</option>
              <option value="Трицепс" ${log.muscle === 'Трицепс' ? 'selected' : ''}>Трицепс</option>
            </select>

            <label>Подходы</label>
            <input type="number" id="edit-log-sets" min="1" max="20" value="${log.set || ''}" placeholder="4" />

            <label>Повторения</label>
            <input type="number" id="edit-log-reps" min="1" max="50" value="${log.reps || ''}" placeholder="8" />

            <label>Вес (кг)</label>
            <input type="number" id="edit-log-weight" min="0" max="500" step="0.5" value="${log.weight || ''}" placeholder="60" />

            <div style="margin-top:1rem;">
              <button type="submit" class="btn">Сохранить</button>
              <button type="button" class="btn btn-ghost" id="cancel-edit-log-btn">Отмена</button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(modal);

      const numberInputs = modal.querySelectorAll('input[type="number"]');
      numberInputs.forEach(input => {
        input.addEventListener('input', (evt) => {
          const value = evt.target.value;
         
          if (!/^\d*$/.test(value)) {
            evt.target.value = value.slice(0, -1);
          }
        });
      });

      const form = modal.querySelector('#edit-log-form');
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        
        const dateStr = modal.querySelector('#edit-log-date').value;
        const timestamp = dateStr ? Math.floor(new Date(dateStr).getTime() / 1000) : Math.floor(Date.now() / 1000);
        
        const updatedLog = {
          ...log,
          data: timestamp,
          name: modal.querySelector('#edit-log-exercise').value.trim(),
          muscle: modal.querySelector('#edit-log-muscle').value,
          set: Number(modal.querySelector('#edit-log-sets').value) || 0,
          reps: Number(modal.querySelector('#edit-log-reps').value) || 0,
          weight: Number(modal.querySelector('#edit-log-weight').value) || 0
        };

        document.body.removeChild(modal);
        resolve(updatedLog);
      });

      const cancelBtn = modal.querySelector('#cancel-edit-log-btn');
      cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(null);
      });

      modal.addEventListener('click', (evt) => {
        if (evt.target === modal) {
          document.body.removeChild(modal);
          resolve(null);
        }
      });
    });
  }
}