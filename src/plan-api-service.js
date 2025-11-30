import ApiService from './framework/view/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PlanApiService extends ApiService {
  get plans() {
    return this._load({ url: 'plan' })
      .then(ApiService.parseResponse);
  }

  async addPlan(plan) {
    const response = await this._load({
      url: 'plan',
      method: Method.POST,
      body: JSON.stringify(plan),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  }

  async updatePlan(plan) {
    const response = await this._load({
      url: `plan/${plan.id}`,
      method: Method.PUT,
      body: JSON.stringify(plan),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  }

  async deletePlan(planID) {
    await this._load({
      url: `plan/${planID}`,
      method: Method.DELETE
    });
  }
}
