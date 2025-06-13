import BaseModel from './BaseModel.js';
// eslint-disable-next-line import/no-cycle
import Task from './Task.js';

class Label extends BaseModel {
  static get tableName() {
    return 'labels';
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Task,
        join: {
          from: 'labels.id',
          through: {
            from: 'task_labels.label_id',
            to: 'task_labels.task_id',
          },
          to: 'tasks.id',
        },
      },
    };
  }
}

export default Label;
