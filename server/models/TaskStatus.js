import BaseModel from './BaseModel.cjs';

class TaskStatus extends BaseModel {
  static get tableName() {
    return 'task_statuses';
  }
}

export default TaskStatus;
