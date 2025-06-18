import objectionUnique from 'objection-unique';
import BaseModel from './BaseModel.js';
import { encrypt } from '../lib/secure.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  set password(value) {
    this.plainPassword = value;
    this.passwordDigest = encrypt(value);
  }

  get password() {
    return this.plainPassword;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  $formatDatabaseJson(json) {
    const dbJson = super.$formatDatabaseJson(json);
    delete dbJson.plainPassword;
    return dbJson;
  }

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.passwordDigest = encrypt(this.password);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}
