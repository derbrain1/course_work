import Observable from '../framework/observable.js';
import { UpdateType } from '../constants/const.js';

export default class PlanModel extends Observable {
  #planApiService = null;
  #plans = [];

  constructor(planApiService) {
    super();
    this.#planApiService = planApiService;
  }

  get plans() {
    return this.#plans;
  }

  async init() {
    try {
      const plans = await this.#planApiService.plans;
      this.#plans = plans;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#plans = [];
      this._notify(UpdateType.INIT);
    }
  }

  async addPlan(plan) {
    try {
      const newPlan = await this.#planApiService.addPlan(plan);
      this.#plans.push(newPlan);
      this._notify(UpdateType.MINOR);
      return newPlan;
    } catch (err) {
      throw err;
    }
  }

  async updatePlan(plan) {
    try {
      const updatedPlan = await this.#planApiService.updatePlan(plan);
      const index = this.#plans.findIndex((p) => p.id === plan.id);
      if (index !== -1) {
        this.#plans[index] = updatedPlan;
        this._notify(UpdateType.MINOR);
      }
      return updatedPlan;
    } catch (err) {
      throw err;
    }
  }

  async deletePlan(planID) {
    try {
      await this.#planApiService.deletePlan(planID);
      this.#plans = this.#plans.filter((p) => p.id !== planID);
      this._notify(UpdateType.MINOR);
    } catch (err) {
      throw err;
    }
  }
}