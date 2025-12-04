import { AbstractComponent } from '../framework/view/abstract-component.js';

function createStatisticsComponentTemplate() {
  return (
    `<section id="stats-section">
      <h2 class="section-title">Статистика прогресса</h2>
      <div class="row">
        <div class="card">
          <h3>Выбор упражнения для анализа</h3>
          <div class="stats-controls">
            <label>Упражнение</label>
            <select id="stats-exercise">
              <option value="">Выберите упражнение</option>
            </select>
            
            <div id="exercise-info" class="exercise-info">
              <div class="exercise-info-grid">
                <div>
                  <small>Мышечная группа:</small>
                  <div id="info-muscle" class="info-value"></div>
                </div>
                <div>
                  <small>Записей в журнале:</small>
                  <div id="info-count" class="info-value"></div>
                </div>
                <div>
                  <small>Макс. вес:</small>
                  <div id="info-max-weight" class="info-value"></div>
                </div>
                <div>
                  <small>Последняя тренировка:</small>
                  <div id="info-last-date" class="info-date"></div>
                </div>
              </div>
            </div>
          </div>
          
          <label>Период</label>
          <select id="stats-period">
            <option value="7">Последние 7 дней</option>
            <option value="30">Последние 30 дней</option>
            <option value="90">Последние 90 дней</option>
            <option value="365">Последние 365 дней</option>
            <option value="0">Вся история</option>
          </select>
          
          <div class="stats-buttons">
            <button class="btn" id="show-stats-btn">Показать статистику</button>
            <button class="btn btn-ghost" id="clear-stats-btn">Очистить</button>
          </div>
        </div>
        
        <div class="card" id="stats-chart-container">
          <h3 id="stats-chart-title">Прогресс рабочих весов</h3>
          <div class="chart" id="progress-chart">
            <p class="stats-placeholder">Выберите упражнение и нажмите "Показать статистику"</p>
          </div>
          
          <div id="stats-summary" class="stats-summary"></div>
        </div>
      </div>
    </section>`
  );
}

export default class StatisticsComponent extends AbstractComponent {
  #logModel = null;
  #exercisesModel = null;
  #selectedExercise = null;

  constructor(logModel, exercisesModel) {
    super();
    this.#logModel = logModel;
    this.#exercisesModel = exercisesModel;
  }

  get template() {
    return createStatisticsComponentTemplate();
  }

  bind() {
    this.#populateExercises();
    
    const exerciseSelect = this.element.querySelector('#stats-exercise');
    exerciseSelect.addEventListener('change', (evt) => {
      this.#onExerciseSelect(evt.target.value);
    });
    
    const showBtn = this.element.querySelector('#show-stats-btn');
    showBtn.addEventListener('click', () => {
      this.#showStatistics();
    });
    
    const clearBtn = this.element.querySelector('#clear-stats-btn');
    clearBtn.addEventListener('click', () => {
      this.#clearStatistics();
    });
  }

  async #populateExercises() {
    const exerciseSelect = this.element.querySelector('#stats-exercise');
    
    const uniqueExercises = this.#logModel.getUniqueExercises();
    
    exerciseSelect.innerHTML = '<option value="">Выберите упражнение</option>';
    
    uniqueExercises.sort().forEach(exerciseName => {
      const option = document.createElement('option');
      option.value = exerciseName;
      option.textContent = exerciseName;
      exerciseSelect.appendChild(option);
    });
    
    if (uniqueExercises.length === 0) {
      exerciseSelect.innerHTML = '<option value="">Нет данных в журнале</option>';
      exerciseSelect.disabled = true;
    }
  }

  #onExerciseSelect(exerciseName) {
    this.#selectedExercise = exerciseName;
    
    const infoContainer = this.element.querySelector('#exercise-info');
    
    if (!exerciseName) {
      infoContainer.style.display = 'none';
      return;
    }
    
    const exerciseInfo = this.#logModel.getExerciseInfo(exerciseName);
    
    if (!exerciseInfo) {
      infoContainer.style.display = 'none';
      return;
    }
    
    this.element.querySelector('#info-muscle').textContent = exerciseInfo.muscleGroup;
    this.element.querySelector('#info-count').textContent = exerciseInfo.totalLogs;
    this.element.querySelector('#info-max-weight').textContent = `${exerciseInfo.maxWeight} кг`;
    
    const lastDate = new Date(exerciseInfo.lastDate * 1000);
    const dateStr = lastDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    this.element.querySelector('#info-last-date').textContent = dateStr;
    
    infoContainer.style.display = 'block';
    
    if (exerciseInfo.totalLogs > 0) {
      setTimeout(() => this.#showStatistics(), 100);
    }
  }

  #showStatistics() {
    if (!this.#selectedExercise) {
      alert('Пожалуйста, выберите упражнение');
      return;
    }
    
    const periodSelect = this.element.querySelector('#stats-period');
    const periodDays = parseInt(periodSelect.value);
    
    const exerciseInfo = this.#logModel.getExerciseInfo(this.#selectedExercise);
    if (!exerciseInfo) {
      this.#renderNoData();
      return;
    }
    
    let logs = this.#logModel.getLogsByExerciseName(this.#selectedExercise, periodDays);
    
    logs = logs.filter(log => log.muscle === exerciseInfo.muscleGroup);
    
    if (logs.length === 0) {
      this.#renderNoData();
      return;
    }
    
    this.#renderChart(logs, this.#selectedExercise);
    this.#renderStatsSummary(logs);
  }

  #clearStatistics() {
    this.#selectedExercise = null;
    
    const exerciseSelect = this.element.querySelector('#stats-exercise');
    exerciseSelect.value = '';
    
    const infoContainer = this.element.querySelector('#exercise-info');
    infoContainer.style.display = 'none';
    
    this.#renderNoData();
  }

  #renderNoData() {
    const chartContainer = this.element.querySelector('#progress-chart');
    const title = this.element.querySelector('#stats-chart-title');
    
    title.textContent = 'Прогресс рабочих весов';
    chartContainer.innerHTML = `
      <p class="stats-placeholder">Выберите упражнение для просмотра статистики</p>
    `;
    
    this.element.querySelector('#stats-summary').innerHTML = '';
  }

  #renderChart(logs, exerciseName) {
    const chartContainer = this.element.querySelector('#progress-chart');
    const title = this.element.querySelector('#stats-chart-title');
    
    title.textContent = `Прогресс рабочих весов - ${exerciseName}`;
    
    const chartData = this.#prepareChartData(logs);
    
    chartContainer.innerHTML = this.#createChartHTML(chartData);
  }

  #prepareChartData(logs) {
    const groupedByDate = logs.reduce((acc, log) => {
      const date = new Date(log.data * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const dateLabel = date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit' 
      });
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          dateLabel: dateLabel,
          weights: [],
          sets: 0,
          totalReps: 0,
          fullDate: date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        };
      }
      
      acc[dateKey].weights.push(log.weight);
      acc[dateKey].sets += log.set || 1;
      acc[dateKey].totalReps += log.reps || 0;
      
      return acc;
    }, {});
    
    const dataArray = Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return dataArray.map(item => ({
      ...item,
      maxWeight: Math.max(...item.weights),
      avgWeight: item.weights.reduce((sum, w) => sum + w, 0) / item.weights.length
    }));
  }

  #createChartHTML(chartData) {
    if (chartData.length === 0) {
      return '<p class="stats-placeholder">Нет данных для отображения</p>';
    }
    
    const maxWeight = Math.max(...chartData.map(d => d.maxWeight));
    const minWeight = Math.min(...chartData.map(d => d.maxWeight));
    const range = maxWeight - minWeight || 1;
    
    let barsHTML = '';
    
    chartData.forEach((data, index) => {
      const heightPercent = 30 + ((data.maxWeight - minWeight) / range) * 60;
      
      barsHTML += `
        <div class="bar-container">
          <div class="bar-wrapper">
            <div class="bar" style="height: ${heightPercent}%;">
              <div class="bar-value">${data.maxWeight} кг</div>
            </div>
          </div>
          <div class="bar-date">${data.fullDate}</div>
        </div>
      `;
    });
    
    return `
      <div class="stats-chart-container">
        <div class="stats-chart-bars">
          ${barsHTML}
        </div>
      </div>
    `;
  }

  #renderStatsSummary(logs) {
    const summaryContainer = this.element.querySelector('#stats-summary');
    
    if (logs.length === 0) {
      summaryContainer.innerHTML = '';
      return;
    }
    
    const totalWeight = logs.reduce((sum, log) => sum + (log.weight || 0), 0);
    const avgWeight = totalWeight / logs.length;
    const maxWeight = Math.max(...logs.map(log => log.weight || 0));
    const minWeight = Math.min(...logs.map(log => log.weight || 0));
    
    const firstDate = new Date(logs[0].data * 1000);
    const lastDate = new Date(logs[logs.length - 1].data * 1000);
    const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    
    const progress = maxWeight - minWeight;
    
    summaryContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">Тренировок</div>
          <div class="stat-value">${logs.length}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Средний вес</div>
          <div class="stat-value">${avgWeight.toFixed(1)} кг</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Макс. вес</div>
          <div class="stat-value">${maxWeight} кг</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Прогресс</div>
          <div class="stat-value ${progress >= 0 ? 'positive' : 'negative'}">
            ${progress >= 0 ? '+' : ''}${progress} кг
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Период</div>
          <div class="stat-value">${daysDiff} дней</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Мин. вес</div>
          <div class="stat-value">${minWeight} кг</div>
        </div>
      </div>
    `;
  }
}