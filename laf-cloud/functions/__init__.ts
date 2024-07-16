


import cloud from '@lafjs/cloud';
import config from '@/config/index';
import { getPermissions, checkPermission, checkToken, hashPassword  } from '@/utils/share'

export default async function (ctx: FunctionContext) {
  console.log("create share func")
  cloud.shared.set('checkPermission', checkPermission);
  cloud.shared.set('getPermissions', getPermissions);
  cloud.shared.set('hashPassword', hashPassword);
  cloud.shared.set('checkToken', checkToken);

  // 初始化配置
  console.log("config")
  config();

  return {
    code: 0,
    data: 'ok',
  };
}
