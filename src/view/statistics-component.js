import { AbstractComponent } from '../framework/view/abstract-component.js';

function createStatisticsComponentTemplate() {
    return (
    `<section id="stats-section">
      <h2 class="section-title">Статистика прогресса</h2>
      <div class="row">
        <div class="card">
          <h3>Выбор упражнения для анализа</h3>
          <label>Упражнение</label>
          <select>
            <option>Жим лежа</option>
            <option>Тяга штанги в наклоне</option>
            <option>Приседания со штангой</option>
            <option>Становая тяга</option>
            <option>Армейский жим</option>
            <option>Подъем штанги на бицепс</option>
          </select>
          <label>Мышечная группа</label>
          <select>
            <option>Грудь</option>
            <option>Спина</option>
            <option>Ноги</option>
            <option>Плечи</option>
            <option>Бицепс</option>
            <option>Трицепс</option>
          </select>
          <label>Период</label>
          <select>
            <option>Последние 7 дней</option>
            <option>Последние 30 дней</option>
            <option>Последние 90 дней</option>
            <option>Вся история</option>
          </select>
          <div style="margin-top:1rem;">
            <a class="btn">Показать статистику</a>
          </div>
        </div>
        
      
        <div class="card">
          <h3>Прогресс рабочих весов - Жим лежа</h3>
          <div class="chart">
            <div class="chart-bars">
              <div class="bar" style="height: 60%;">
                <div class="bar-value">60 кг</div>
                <div class="bar-label">10.10</div>
              </div>
              <div class="bar" style="height: 65%;">
                <div class="bar-value">65 кг</div>
                <div class="bar-label">12.10</div>
              </div>
              <div class="bar" style="height: 62%;">
                <div class="bar-value">62 кг</div>
                <div class="bar-label">15.10</div>
              </div>
              <div class="bar" style="height: 70%;">
                <div class="bar-value">70 кг</div>
                <div class="bar-label">19.10</div>
              </div>
              <div class="bar" style="height: 75%;">
                <div class="bar-value">75 кг</div>
                <div class="bar-label">23.10</div>
              </div>
              <div class="bar" style="height: 80%;">
                <div class="bar-value">80 кг</div>
                <div class="bar-label">25.10</div>
              </div>
            </div>
            <div class="chart-labels">
              <div>Мин: 60кг</div>
              <div>Сред: 68кг</div>
              <div>Макс: 80кг</div>
            </div>
          </div>

    </section> `
    );
}

export default class StatisticsComponent extends AbstractComponent{
    get template() {
    return createStatisticsComponentTemplate();
    }
}