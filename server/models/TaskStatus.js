import BaseModel from './BaseModel.js';

export default class TaskStatus extends BaseModel {
  static get tableName() {
    return 'task_statuses';
  }
}
