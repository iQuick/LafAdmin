import cloud from '@lafjs/cloud';

export { ok, fail } from './call';

export { getPermissions, checkPermission, checkToken, hashPassword } from '@/utils/share';

export const WHITE_COLLECTION_LIST = [
  'schema',
  'schema-api',
  'admin',
  'role',
  'permission',
  'password',
  'oss',
  'oss-manager',
  'request-record',
  'setting',
  'user-token',
];
