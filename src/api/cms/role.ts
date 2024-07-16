import { http } from '@/utils/http/axios';

export function getRoles(params) {
  return http.request({
    url: '/cms/role/list',
    method: 'POST',
    data: params,
  });
}

export function getAllRoles() {
  return http.request({
    url: '/cms/role/all',
    method: 'POST',
    data: {},
  });
}

export function createRole(params) {
  return http.request({
    url: '/cms/role/create',
    method: 'POST',
    data: params,
  });
}

export function updateRole(params) {
  return http.request({
    url: '/cms/role/update',
    method: 'POST',
    data: params,
  });
}

export function deleteRole(id) {
  return http.request({
    url: `/cms/role/delete`,
    method: 'POST',
    data: {
      _id: id,
    },
  });
}
