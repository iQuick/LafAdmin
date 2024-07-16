import { http } from '@/utils/http/axios';
import { BasicPageParams } from '@/api/been/basic';

// /**
//  * @description: 用户登录
//  */
// export function login(params) {
//   return http.request<BasicResponseModel>(
//     {
//       url: '/admin-login',
//       method: 'POST',
//       params,
//     },
//     {
//       isTransformResponse: false,
//     }
//   );
// }

/**
 * @description: 获取用户列表
 * @param {BasicPageParams} params
 * @return {*}
 */
export function getUserList(params: BasicPageParams) {
  return http.request({
    url: '/cms/user/list',
    method: 'POST',
    params,
  });
}

/**
 * @description: 创建用户
 * @param {BasicPageParams} params
 */
export function createUser(params) {
  return http.request({
    url: '/cms/user/create',
    method: 'POST',
    params,
  });
}

/**
 * @description: 更新用户
 * @param {BasicPageParams} params
 * @return {*}
 */
export function updateUser(params) {
  return http.request({
    url: '/cms/user/update',
    method: 'POST',
    params,
  });
}

/**
 * @description: 删除用户
 * @param {BasicPageParams} params
 * @return {*}
 */
export function deleteUser(_id) {
  return http.request({
    url: '/cms/user/delete',
    method: 'POST',
    data: {
      _id,
    },
  });
}

/**
 * @description: 重置用户密码
 * @param params
 */
export function resetPasswordUser(params) {
  return http.request({
    url: '/cms/user/resetpassword',
    method: 'POST',
    params,
  });
}
