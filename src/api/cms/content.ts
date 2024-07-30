import { http } from '@/utils/http/axios';

export function getContents(params) {
  return http.request({
    url: '/cms/content/list',
    method: 'POST',
    data: params,
  });
}

export function getContent({ schemaId, _id }) {
  return http.request({
    url: `/cms/content/info`,
    method: 'POST',
    data: {
      schemaId,
      _id,
    },
  });
}

export function getAllContents(schemaId) {
  return http.request({
    url: '/cms/content/all',
    method: 'POST',
    data: { schemaId },
  });
}

export function createContent({ schemaId, params }) {
  return http.request({
    url: '/cms/content/create',
    method: 'POST',
    data: { params, schemaId },
  });
}

export function updateContent({ params, schemaId, _id }) {
  return http.request({
    url: '/cms/content/update',
    method: 'POST',
    data: { params, schemaId, _id },
  });
}

export function deleteContent({ schemaId, _id }) {
  return http.request({
    url: `/cms/content/delete`,
    method: 'POST',
    data: { schemaId, _id },
  });
}

export function enableContent(schemaId, _id, enable: Boolean) {
  return http.request({
    url: '/cms/content/enable',
    method: 'POST',
    data: {
      schemaId,
      _id,
      status: enable ? 1 : 0,
    },
  });
}
