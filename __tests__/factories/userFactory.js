// @ts-check
import { faker } from '@faker-js/faker';
import { encrypt } from '../../server/lib/secure.js';

export const buildUser = (overrides = {}) => ({
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    ...overrides,
});

export const buildUserWithHash = (overrides = {}) => {
    const user = buildUser(overrides);
    const passwordDigest = encrypt(user.password);
    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password_digest: passwordDigest,
    };
};

export const buildUserWithPassword = (overrides = {}) => {
    const user = buildUser(overrides);
    const hashed = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password_digest: encrypt(user.password),
    };
    return { plain: user, hashed };
};
