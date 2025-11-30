import { AbstractComponent } from '../framework/view/abstract-component.js';

function createHeaderComponentTemplate() {
  return (
    `<header>
      <div class="container">
        <div class="brand">
          <h1>SportTracker</h1>
        </div>
        <nav>
          <a href="#" class="nav-btn" data-view="plan">План</a>
          <a href="#" class="nav-btn" data-view="log">Журнал</a>
          <a href="#" class="nav-btn" data-view="stats">Статистика</a>
          <a href="#" class="nav-btn" data-view="constructor">Конструктор</a>
        </nav>
      </div>
    </header>`
  );
}

export default class HeaderComponent extends AbstractComponent {
  #onNavClick = null;

  constructor(onNavClick) {
    super();
    this.#onNavClick = onNavClick;
    this.#setClickHandler();
  }

  get template() {
    return createHeaderComponentTemplate();
  }

  #setClickHandler() {
    this.element.addEventListener('click', (evt) => {
      const target = evt.target;
      if (!target.classList.contains('nav-btn')) {
        return;
      }
      evt.preventDefault();
      const view = target.dataset.view;
      
      if (this.#onNavClick && typeof this.#onNavClick === 'function') {
        this.#onNavClick(view);
      } 
    });
  }
}