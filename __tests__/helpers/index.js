// @ts-check

import { buildUserWithPassword } from '../factories/userFactory.js';

const prepareData = async (app, options = {}) => {
  const { knex } = app.objection;

  const userPairs = options.users ?? [
    buildUserWithPassword(),
    buildUserWithPassword(),
  ];

  await knex('users').insert(userPairs.map(({ hashed }) => hashed));

  const taskStatuses = [
    { name: 'open' },
    { name: 'in progress' },
    { name: 'closed' },
  ];
  await knex('task_statuses').insert(taskStatuses);

  return {
    users: userPairs.map(({ plain }) => plain),
    taskStatuses,
  };
};

export default prepareData;
