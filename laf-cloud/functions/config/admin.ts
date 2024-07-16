import cloud from '@lafjs/cloud'
import * as assert from 'assert';
import { hashPassword } from '@/utils/share'


const db = cloud.database();

const addAdmin = async (username: string, password: string) => {
  const { total } = await db.collection('admin').count();
  if (total > 0) {
    // console.log('admin already exists');
    return;
  }

  await cloud.mongo.db.collection('admin').createIndex('username', { unique: true });

  const { data } = await db.collection('role').get();
  const roles = data.map((it) => it.name);

  const r_add = await db.collection('admin').add({
    username,
    avatar: ['https://laf.run/logo.png'],
    name: 'Admin',
    roles,
    status: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
  });
  assert.ok(r_add.id, 'add admin occurs error');

  await db.collection('password').add({
    uid: r_add.id,
    password: hashPassword(password),
    type: 'admin',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return r_add.id;
}

export default async function configAdmin() {
  await addAdmin('admin', '123456')
}

