import {render, RenderPosition} from './framework/render.js';
import HeaderComponent from './view/header-component.js';
import FooterComponent from './view/footer-component.js';
import BoardPresenter from './presenter/board-presenter.js';
import PlanApiService from './plan-api-service.js';
import PlanModel from './model/plan-model.js';
import LogApiService from './log-api-service.js';
import LogModel from './model/log-model.js';
import ExercisesApiService from './exercises-api-service.js'; 
import ExercisesModel from './model/exercises-model.js'; 

const bodyContainer = document.querySelector('.board-app');
const mainContainer = document.querySelector('main');

const API_ENDPOINT2 = 'https://6931bbeb11a8738467d0528e.mockapi.io'; 
const API_ENDPOINT = 'https://692c4543c829d464006f0b45.mockapi.io'; 
const planApiService = new PlanApiService(API_ENDPOINT);
const planModel = new PlanModel(planApiService);

const logApiService = new LogApiService(API_ENDPOINT);
const logModel = new LogModel(logApiService);


const exercisesApiService = new ExercisesApiService(API_ENDPOINT2);
const exercisesModel = new ExercisesModel(exercisesApiService);

const boardPresenter = new BoardPresenter(mainContainer, planModel, logModel, exercisesModel); 

const headerComponent = new HeaderComponent((view) => {
  switch (view) {
    case 'plan':
      boardPresenter.showPlan();
      break;
    case 'log':
      boardPresenter.showLog();
      break;
    case 'stats':
      boardPresenter.showStats();
      break;
    case 'constructor':
      boardPresenter.showConstructor();
      break;
    default:
      boardPresenter.showPlan();
  }
});

Promise.all([
  planModel.init(),
  logModel.init(),
  exercisesModel.init() 
]).then(() => {
  boardPresenter.init();
}).catch((err) => {
  boardPresenter.init();
});

render(headerComponent, bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FooterComponent(), bodyContainer, RenderPosition.AFTEREND);
