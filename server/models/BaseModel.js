import { Model } from 'objection';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
  }
}
