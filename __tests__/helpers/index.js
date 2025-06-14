// @ts-check

import { buildUserWithPassword } from '../factories/userFactory.js';

const prepareData = async (app, options = {}) => {
  const { knex } = app.objection;

  const userPairs = options.users ?? [
    buildUserWithPassword(),
    buildUserWithPassword(),
  ];

  await knex('users').insert(userPairs.map(({ hashed }) => hashed));
  const insertedUsers = await knex('users').select();

  insertedUsers.forEach((insertedUser, index) => {
    userPairs[index].plain.id = insertedUser.id;
  });

  const taskStatuses = [
    { name: 'open' },
    { name: 'in progress' },
    { name: 'closed' },
  ];
  await knex('task_statuses').insert(taskStatuses);
  const insertedStatuses = await knex('task_statuses').select();

  return {
    users: userPairs.map(({ plain }) => plain),
    taskStatuses: insertedStatuses,
  };
};

export default prepareData;
