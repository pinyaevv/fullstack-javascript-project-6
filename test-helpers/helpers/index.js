// @ts-check

import { buildUserWithPassword } from '../../test-helpers/factories/userFactory.js';

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

  const labels = [
    { name: 'frontend' },
    { name: 'backend' },
  ];
  await knex('labels').insert(labels);
  const insertedLabels = await knex('labels').select();

  return {
    users: userPairs.map(({ plain }) => plain),
    taskStatuses: insertedStatuses,
    labels: insertedLabels,
  };
};

export default prepareData;
