// @ts-check
const objectionUnique = require('objection-unique');
const BaseModel = require('./BaseModel.cjs');
const encrypt = require('../lib/secure.cjs');

const unique = objectionUnique({ fields: ['email'] });

module.exports = class User extends unique(BaseModel) {
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
      },
    };
  }

  set password(value) {
    this._password = value;
    this.passwordDigest = encrypt(value);
  }

  get password() {
    return this._password;
  }

  $formatDatabaseJson(json) {
    const dbJson = super.$formatDatabaseJson(json);
    delete dbJson._password;
    return dbJson;
  }

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.passwordDigest = encrypt(this.password);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
};
