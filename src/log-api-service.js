import ApiService from './framework/view/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class LogApiService extends ApiService {
  get logs() {
    return this._load({ url: 'logs' })
      .then(ApiService.parseResponse);
  }

  async addLog(log) {
    const response = await this._load({
      url: 'logs',
      method: Method.POST,
      body: JSON.stringify(log),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  }

  async updateLog(log) {
    const response = await this._load({
      url: `logs/${log.id}`,
      method: Method.PUT,
      body: JSON.stringify(log),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  }

  async deleteLog(logID) {
    await this._load({
      url: `logs/${logID}`,
      method: Method.DELETE
    });
  }
}