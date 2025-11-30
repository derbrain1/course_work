import { AbstractComponent } from '../framework/view/abstract-component.js';

function createConstructorComponentTemplate() {
    return (
    `<section id="builder-section">
      <h2 class="section-title">Конструктор упражнений</h2>
      <div class="row">
        <div class="card">
          <h3>Создать упражнение</h3>
          <label>Название упражнения</label>
          <input placeholder="Напр. Жим гантелей на наклонной" />
          
          <label>Мышечная группа</label>
          <select>
            <option>Грудь</option>
            <option>Спина</option>
            <option>Ноги</option>
            <option>Плечи</option>
            <option>Бицепс</option>
            <option>Трицепс</option>
          </select>
          
          <label>Оборудование</label>
          <select>
            <option>Штанга</option>
            <option>Гантели</option>
            <option>Тренажер</option>
            <option>Собственный вес</option>
          </select>
          
          <label>Техника/подсказки</label>
          <textarea rows="4" placeholder="Амплитуда, темп, паузы, особенности техники..."></textarea>
          
          <div style="margin-top:1rem;">
            <a class="btn">Сохранить</a>
            <a class="btn btn-ghost">Очистить</a>
            <a class="btn" style="background: linear-gradient(135deg, #ff6a6a, #e05555);">Удалить</a>
          </div>
        </div>
        
        <div class="card">
          <h3>Справочник упражнений</h3>
          <div class="rowline" style="cursor: pointer;">
            <div>Приседания со штангой</div>
            <div class="chip chip-legs">Ноги</div>
            <div class="chip">Штанга</div>
          </div>
          <div class="rowline" style="cursor: pointer;">
            <div>Тяга верхнего блока</div>
            <div class="chip chip-back">Спина</div>
            <div class="chip">Тренажер</div>
          </div>
          <div class="rowline" style="cursor: pointer;">
            <div>Жим лежа на горизонтальной</div>
            <div class="chip chip-chest">Грудь</div>
            <div class="chip">Штанга</div>
          </div>
          <div class="rowline" style="cursor: pointer;">
            <div>Армейский жим стоя</div>
            <div class="chip chip-shoulders">Плечи</div>
            <div class="chip">Штанга</div>
          </div>
          
          <!-- Просмотр упражнения -->
          <div class="exercise-preview">
            <h4>Армейский жим стоя</h4>
            <div class="exercise-detail">
              <label>Мышечная группа:</label>
              <div><span class="chip chip-shoulders">Плечи</span></div>
            </div>
            <div class="exercise-detail">
              <label>Оборудование:</label>
              <div><span class="chip">Штанга</span></div>
            </div>
            <div class="exercise-detail">
              <label>Техника выполнения:</label>
              <div class="exercise-technique">
                • Встаньте прямо, ноги на ширине плеч<br>
                • Возьмите штангу хватом чуть шире плеч<br>
                • Поднимите штангу на грудь, затем над головой<br>
                • Локти направлены вперед, спина прямая<br>
                • Опускайте штангу контролируемо до уровня ключиц<br>
                • Повторите движение в полной амплитуде
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`
    );
}

export default class ConstructorComponent extends AbstractComponent{
    get template() {
    return createConstructorComponentTemplate();
    }
}