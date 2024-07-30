import cloud from '@lafjs/cloud';
import config from '@/config/index';
import trigger from '@/trigger/index'

export default async function (ctx: FunctionContext) {
  console.log("create share")
  // cloud.shared.set('checkPermission', checkPermission);
  // cloud.shared.set('getPermissions', getPermissions);
  // cloud.shared.set('hashPassword', hashPassword);
  // cloud.shared.set('checkToken', checkToken);

  // 初始化触发器
  console.log("triggers")
  await trigger()

  // 初始化配置
  console.log("config")
  await config();

  return {
    code: 0,
    data: 'ok',
  };
}
