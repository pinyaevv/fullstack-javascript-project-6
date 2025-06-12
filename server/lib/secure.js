import crypto from 'crypto';

export const encrypt = (value) => crypto.createHash('sha256')
  .update(value)
  .digest('hex');

export const verify = (value, hash) => encrypt(value) === hash;
