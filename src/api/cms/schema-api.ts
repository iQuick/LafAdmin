import { http } from '@/utils/http/axios';

export function getSchemaApiAll() {
  return http.request({
    url: `/cms/schema-api/all`,
    method: 'POST',
    data: {},
  });
}

export function getSchemaApi(name) {
  return http.request({
    url: `/cms/schema-api/get`,
    method: 'POST',
    data: {
      collectionName: name,
    },
  });
}

export function createSchemaApi(params) {
  return http.request({
    url: '/cms/schema-api/create',
    method: 'POST',
    data: params,
  });
}

export function updateSchemaApi(params) {
  return http.request({
    url: '/cms/schema-api/update',
    method: 'POST',
    data: params,
  });
}

export function deleteSchemaApi(data) {
  return http.request({
    url: '/cms/schema-api/delete',
    method: 'POST',
    data,
  });
}
