import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken, WHITE_COLLECTION_LIST } from '@/system/sys';
import { INVALID_COLLECTION_NAME, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.api.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { collectionName, displayName } = ctx.body;
  if (!collectionName || !displayName) {
    return fail(PARAMS_EMPTY);
  }

  // check collectionName
  if (WHITE_COLLECTION_LIST.indexOf(collectionName) > -1) {
    return fail(INVALID_COLLECTION_NAME);
  }

  // check exist
  const { total } = await db.collection('schema-api').where({ collectionName }).count();
  if (total > 0) {
    await db.collection('schema-api').where({ collectionName }).remove();
  }

  const api = {
    displayName: displayName,
    collectionName: collectionName,
    enable: false,
    apis: {
      read: {
        target: 'api/schema/read',
        enable: false,
        token: false,
        tokenEdit: true,
        displayName: '读取 / Read',
        url: `/api/schema/${collectionName}/{id}`,
        method: 'GET',
        params: {
          id: '数据ID（可选:传入ID返回对应数据，不传则返回列表）',
          page: '分页(列表可选)',
          count: '分页数据数(列表可选)',
          order: '排序字段(列表可选)',
        },
        body: {},
      },
      add: {
        target: 'api/schema/add',
        enable: false,
        token: false,
        tokenEdit: true,
        displayName: '添加 / Add',
        url: `/api/schema/${collectionName}`,
        method: 'POST',
        params: {},
        body: {},
      },
      update: {
        target: 'api/schema/update',
        enable: false,
        token: false,
        tokenEdit: true,
        displayName: '更新 / Update',
        url: `/api/schema/${collectionName}/{id}`,
        method: 'PUT',
        params: {},
        body: {},
      },
      remove: {
        target: 'api/schema/remove',
        enable: false,
        token: false,
        tokenEdit: true,
        displayName: '删除 / Remove',
        url: `/api/schema/${collectionName}/{id}`,
        method: 'DELETE',
        params: {},
        body: {},
      },
    },
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  // add collection to schema
  const addRes = await db.collection('schema-api').add(api);

  return ok(addRes);
}
