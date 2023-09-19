import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message?: string;
  result?: T;
  data?: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

export function getRoles(params) {
  return http.request({
    url: '/role-list',
    method: 'POST',
    data: params,
  });
}

export function getAllRoles() {
  return http.request({
    url: '/role-all',
    method: 'POST',
    data: {},
  });
}

export function createRole(params) {
  return http.request({
    url: '/role-create',
    method: 'POST',
    data: params,
  });
}

export function updateRole(params) {
  return http.request({
    url: '/role-update',
    method: 'POST',
    data: params,
  });
}

export function deleteRole(id) {
  return http.request({
    url: `/role-delete`,
    method: 'POST',
    data: {
      _id: id,
    },
  });
}
