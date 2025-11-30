import Observable from '../framework/observable.js';
import { UpdateType } from '../constants/const.js';

export default class LogModel extends Observable {
  #logApiService = null;
  #logs = [];

  constructor(logApiService) {
    super();
    this.#logApiService = logApiService;
  }

  get logs() {
    return this.#logs;
  }

  async init() {
    try {

      const logs = await this.#logApiService.logs;

      this.#logs = logs;
      this._notify(UpdateType.INIT);
    } catch (err) {

      this.#logs = [];
      this._notify(UpdateType.INIT);
    }
  }

  async addLog(log) {
    try {
      const newLog = await this.#logApiService.addLog(log);
      this.#logs.push(newLog);
      this._notify(UpdateType.MINOR);
      return newLog;
    } catch (err) {
     
      throw err;
    }
  }

  async updateLog(log) {
    try {
      const updatedLog = await this.#logApiService.updateLog(log);
      const index = this.#logs.findIndex((l) => l.id === log.id);
      if (index !== -1) {
        this.#logs[index] = updatedLog;
        this._notify(UpdateType.MINOR);
      }
      return updatedLog;
    } catch (err) {
      
      throw err;
    }
  }

  async deleteLog(logID) {
    try {
      await this.#logApiService.deleteLog(logID);
      this.#logs = this.#logs.filter((l) => l.id !== logID);
      this._notify(UpdateType.MINOR);
    } catch (err) {
      throw err;
    }
  }
}