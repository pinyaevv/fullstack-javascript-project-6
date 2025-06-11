// @ts-check

import { buildUserWithHash } from '../factories/userFactory.js';

const prepareData = async (app, options = {}) => {
  const { knex } = app.objection;

  const users = options.users ?? [await buildUserWithHash(), await buildUserWithHash()];
  await knex('users').insert(users);

  const taskStatuses = [
    { name: 'open' },
    { name: 'in progress' },
    { name: 'closed' },
  ];
  await knex('task_statuses').insert(taskStatuses);

  return {
    users,
  };
};

export default prepareData;
