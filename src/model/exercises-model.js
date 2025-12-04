import Observable from '../framework/observable.js';
import { UpdateType } from '../constants/const.js';

export default class ExercisesModel extends Observable {
  #exercisesApiService = null;
  #exercises = [];

  constructor(exercisesApiService) {
    super();
    this.#exercisesApiService = exercisesApiService;
  }

  get exercises() {
    return this.#exercises;
  }

  async init() {
    try {
      const exercises = await this.#exercisesApiService.exercises;
      this.#exercises = exercises;
      this._notify(UpdateType.INIT);
    } catch (err) {
      this.#exercises = [];
      this._notify(UpdateType.INIT);
    }
  }

  async addExercise(exercise) {
    try {
      const newExercise = await this.#exercisesApiService.addExercise(exercise);
      this.#exercises.push(newExercise);
      this._notify(UpdateType.MINOR);
      return newExercise;
    } catch (err) {
      throw err;
    }
  }

  async updateExercise(exercise) {
    try {
      const updatedExercise = await this.#exercisesApiService.updateExercise(exercise);
      const index = this.#exercises.findIndex((e) => e.id === exercise.id);
      if (index !== -1) {
        this.#exercises[index] = updatedExercise;
        this._notify(UpdateType.MINOR);
      }
      return updatedExercise;
    } catch (err) {
      throw err;
    }
  }

  async deleteExercise(exerciseID) {
    try {
      await this.#exercisesApiService.deleteExercise(exerciseID);
      this.#exercises = this.#exercises.filter((e) => e.id !== exerciseID);
      this._notify(UpdateType.MINOR);
    } catch (err) {
      throw err;
    }
  }

  getExercisesByMuscleGroup(muscleGroup) {
    return this.#exercises.filter(exercise => 
      exercise.muscle_group === muscleGroup
    );
  }
}
