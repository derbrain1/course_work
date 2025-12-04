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
  

  getLogsByExerciseName(exerciseName, periodDays = null) {
    let filtered = this.#logs.filter(log => 
      log.name.toLowerCase() === exerciseName.toLowerCase()
    );

    if (periodDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - periodDays);
      const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);
      
      filtered = filtered.filter(log => log.data >= cutoffTimestamp);
    }

     
    return filtered.sort((a, b) => a.data - b.data);
  }

  getUniqueExercises() {
    const exercises = this.#logs.map(log => log.name);
    return [...new Set(exercises)];
  }
   

  getExerciseInfo(exerciseName) {
    const logs = this.#logs.filter(log => 
      log.name.toLowerCase() === exerciseName.toLowerCase()
    );
    
    if (logs.length === 0) return null;
    
   
    const muscleGroups = logs.reduce((acc, log) => {
      acc[log.muscle] = (acc[log.muscle] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonMuscle = Object.entries(muscleGroups)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      name: exerciseName,
      muscleGroup: mostCommonMuscle,
      totalLogs: logs.length,
      lastDate: Math.max(...logs.map(log => log.data)),
      maxWeight: Math.max(...logs.map(log => log.weight))
    };
  }
}