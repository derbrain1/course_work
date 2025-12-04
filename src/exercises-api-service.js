import ApiService from './framework/view/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ExercisesApiService extends ApiService {
  get exercises() {
    return this._load({ url: 'exercises' })
      .then(ApiService.parseResponse);
  }

  async addExercise(exercise) {
    const response = await this._load({
      url: 'exercises',
      method: Method.POST,
      body: JSON.stringify(exercise),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  }

  async updateExercise(exercise) {
    const response = await this._load({
      url: `exercises/${exercise.id}`,
      method: Method.PUT,
      body: JSON.stringify(exercise),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  }

  async deleteExercise(exerciseID) {
    await this._load({
      url: `exercises/${exerciseID}`,
      method: Method.DELETE
    });
  }
}
