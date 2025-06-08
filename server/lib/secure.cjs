// @ts-check

const crypto = require('crypto');

const encrypt = (value) => crypto.createHash('sha256')
  .update(value)
  .digest('hex');

const verify = (value, hash) => encrypt(value) === hash;

module.exports = { encrypt, verify };
