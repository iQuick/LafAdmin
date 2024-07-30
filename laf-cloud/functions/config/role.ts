import cloud from '@lafjs/cloud'
import * as assert from 'assert';


const db = cloud.database();
const mongo = cloud.mongo.db;

export default async function configRole() {
  try {
    await mongo.collection('role').createIndex('name', { unique: true });
    const r_perm = await db.collection('permission').get();
    assert.ok(r_perm, 'get permissions failed');

    const permissions = r_perm.data.map((it) => it.name);
    const r_add = await db.collection('role').add({
      name: 'superadmin',
      label: '超级管理员',
      description: '系统初始化的超级管理员',
      permissions,
      status: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    assert.ok(r_add.id, 'add role occurs error');

    return r_add.id;
  } catch (error) {
    if (error.code == 11000) {
      return console.log('permissions already exists');
    }
  }
}
