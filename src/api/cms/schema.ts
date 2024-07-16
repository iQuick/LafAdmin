import { http } from '@/utils/http/axios';

export function getSchemas(params) {
  return http.request({
    url: '/cms/schema/list',
    method: 'POST',
    data: params,
  });
}

export function getSchema(id) {
  return http.request({
    url: `/cms/schema/get`,
    method: 'POST',
    data: {
      _id: id,
    },
  });
}

export function getSchemaAll() {
  return http.request({
    url: '/cms/schema/all',
    method: 'POST',
    data: {},
  });
}

export function createSchema(params) {
  return http.request({
    url: '/cms/schema/create',
    method: 'POST',
    data: params,
  });
}

export function updateSchema(params) {
  return http.request({
    url: '/cms/schema/update',
    method: 'POST',
    data: params,
  });
}

export function deleteSchema(data) {
  return http.request({
    url: `/cms/schema/delete`,
    method: 'POST',
    data,
  });
}
