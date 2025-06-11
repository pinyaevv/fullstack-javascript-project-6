// @ts-check
import { faker } from '@faker-js/faker';
import { encrypt } from '../../server/lib/secure.cjs';

export const buildUser = (overrides = {}) => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  ...overrides,
});

export const buildUserWithHash = (overrides = {}) => {
  const user = buildUser(overrides);
  const passwordDigest = encrypt(user.password);
  return { ...user, passwordDigest };
};
