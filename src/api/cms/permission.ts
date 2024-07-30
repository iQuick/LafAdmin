import { http } from '@/utils/http/axios';

export function getPermissions(params) {
  return http.request({
    url: '/cms/permission/list',
    method: 'POST',
    data: params,
  });
}

export function getAllPermissions() {
  return http.request({
    url: '/cms/permission/all',
    method: 'POST',
    data: {},
  });
}

export function createPermission(params) {
  return http.request({
    url: '/cms/permission/create',
    method: 'POST',
    data: params,
  });
}

export function updatePermission(params) {
  return http.request({
    url: '/cms/permission/update',
    method: 'POST',
    data: params,
  });
}

export function deletePermission(id) {
  return http.request({
    url: `/cms/permission/delete`,
    method: 'POST',
    data: {
      _id: id,
    },
  });
}

export function enablePermission(_id, enable: Boolean) {
  return http.request({
    url: '/cms/permission/enable',
    method: 'POST',
    data: {
      _id,
      status: enable ? 1 : 0,
    },
  });
}
