import { AbstractComponent } from '../framework/view/abstract-component.js';

function createFooterComponentTemplate() {
    return (
    `<footer>
    <div class="footer-content">
        <div class="footer-section">
            <p>Надежный помощник для спортсменов</p>
        </div>
        
    </div>
    <div class="copyright">
        <p>&copy; 2025 SportTracker. Все права защищены.</p>
    </div>
</footer>`
    );
}

export default class FooterComponent extends AbstractComponent{
    get template() {
    return createFooterComponentTemplate();
    }
}