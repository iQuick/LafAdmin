import cloud from '@lafjs/cloud';

const db = cloud.database();
const mongo = cloud.mongo.db;

export async function updateSchema(uid, schema, target) {
  const { collectionName, displayName, description, fields } = target;
  const data = {} as any;
  const sdata = {} as any;

  if (collectionName && collectionName !== schema.collectionName) {
    data.collectionName = collectionName;
    sdata.collectionName = collectionName;
    sdata.apis = {
      add: { url: `/api/schema/${collectionName}` },
      read: { url: `/api/schema/${collectionName}/{id}` },
      update: { url: `/api/schema/${collectionName}/{id}` },
      remove: { url: `/api/schema/${collectionName}/{id}` }
    };
  }

  if (displayName && displayName !== schema.displayName) {
    data.displayName = displayName;
    sdata.displayName = displayName;
  }

  if (fields) {
    data.fields = fields;
    const addFiledBody = {};
    const updateFiledBody = {};
    fields
      .filter((field) => {
        return !(field.name == 'updated_at' || field.name == 'created_at');
      })
      .forEach((field) => {
        addFiledBody[field.name] = `${field.displayName}(${field.isRequired ? '必须' : '可选'} | ${field.type})`;
        updateFiledBody[field.name] = `${field.displayName}(可选 | ${field.type})`;
      });
    sdata.apis = {
      add: { body: addFiledBody },
      update: { body: updateFiledBody },
    };
  }

  if (description) {
    data.description = description;
  }

  // update schema
  if (data) {
    await db.collection('schema').doc(schema._id).update({ ...data, updated_at: Date.now() });
  }

  if (sdata) {
    const sapi = await db
      .collection('schema-api')
      .where({ collectionName: schema.collectionName });
    await sapi.update({
      apis: {
        read: {
          body: db.command.remove(),
        },
        add: {
          body: db.command.remove(),
        },
        update: {
          body: db.command.remove(),
        },
        remove: {
          body: db.command.remove(),
        },
      },
      updated_at: Date.now(),
    });
    await sapi.update({ ...sdata, updated_at: Date.now() });
  }

  const orn = createRoleName(schema.collectionName);
  const odrn = createDisplayRoleName(schema.displayName);
  const nrn = createRoleName(collectionName);
  const ndrn = createDisplayRoleName(displayName);
  if (displayName && displayName !== schema.displayName) {
    console.log((await mongo.collection('admin').updateMany(
      { "roles": orn },
      { $set: { "roles.$": nrn, updated_at: Date.now() } }
    )));

    console.log((await mongo.collection('permission').bulkWrite([
      {
        updateOne: {
          filter: { label: `${schema.displayName}菜单` },
          update: {
            $set: { label: `${displayName}菜单`, updated_at: Date.now() }
          }
        }
      },
      ...['创建', '读取', '编辑', '删除'].map(v => ({
        updateOne: {
          filter: { label: `${v}${schema.displayName}` },
          update: {
            $set: { label: `${v}${displayName}`, updated_at: Date.now() }
          }
        }
      }))
    ])));
  }

  if (collectionName && collectionName !== schema.collectionName) {
    console.log((await db.collection('role').where({
      name: orn,
      label: odrn
    }).update({
      name: nrn,
      label: ndrn,
      updated_at: Date.now(),
    })));

    const opms = createPms(schema.collectionName)
    const npms = createPms(collectionName)
    const bulkOps = opms.map((opm, i) => ({
      updateMany: {
        filter: { permissions: opm },
        update: { $set: { "permissions.$": npms[i], updated_at: Date.now() } }
      }
    }));
    console.log(await mongo.collection('role').bulkWrite(bulkOps));

    const updateOperations = ['menu', 'create', 'delete', 'edit', 'read'].map(v => ({
      updateOne: {
        filter: { name: `pms.content.${schema.collectionName}.${v}` },
        update: { $set: { name: `pms.content.${collectionName}.${v}`, updated_at: Date.now() } }
      }
    }));
    console.log((await mongo.collection('permission').bulkWrite(updateOperations)));

  }


}

export async function deleteSchema(uid, schema) {
  // delete schema
  await db.collection('schema').doc(schema._id).remove();
  await db.collection('schema-api').where({ collectionName: schema.collectionName }).remove();

  const collectionName = schema.collectionName;
  // update permission
  const pms = createPms(collectionName);
  const role = createRoleName(schema.collectionName);
  console.log((await mongo.collection('role').updateMany(
    {},
    { $pull: { permissions: { $in: pms } } }
  )));
  console.log((await mongo.collection('admin').updateMany(
    {},
    { $pull: { roles: { $in: [role] } } }
  )));

  // delete role
  console.log((await db.collection('role').where({ name: role }).remove()));
  console.log((await mongo.collection('permission').deleteMany({
    name: { $in: pms }
  })));
}

export async function createSchema(uid, displayName, collectionName, fields, description) {
  // schema
  const schema = await createSchemaCollection(displayName, collectionName, fields, description);
  await db.collection('schema').add(schema);
  // api
  const schema_api_db = db.collection('schema-api').where({ collectionName })
  const { total } = await schema_api_db.count();
  if (total > 0) {
    await schema_api_db.remove();
  }
  const api = await createSchemaApi(displayName, collectionName);
  await db.collection('schema-api').add(api)
  // permission
  const permissions = await createSchemaPermission(displayName, collectionName);
  for (const perm of permissions) {
    try {
      const data = {
        ...perm,
        status: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      await db.collection('permission').add(data);
    } catch (error) {
      if (error.code == 11000) {
        console.log('permissions already exists');
        continue;
      }
    }
  }

  // role
  const pms = createPms(collectionName);
  const role = await createSchemaRole(displayName, collectionName, pms);
  await db.collection('role').add(role);

  // update permission
  await mongo.collection('role').updateMany(
    { name: 'superadmin' },
    { $push: { permissions: { $each: pms } } }
  )

  await mongo.collection('admin').updateMany(
    { '_id': uid },
    { $push: { roles: createRoleName(collectionName) } }
  )

  return 'ok';
}

async function createSchemaCollection(displayName, collectionName, fields, description) {
  return {
    displayName,
    collectionName,
    fields: [
      ...fields,
      {
        displayName: '状态',
        name: 'status',
        type: 'Number',
        id: 'status',
        isSystem: true,
        description: 'CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段',
      },
      {
        displayName: '创建时间',
        name: 'created_at',
        type: 'DateTime',
        dateFormatType: 'timestamp-ms',
        id: 'created_at',
        isSystem: true,
        description: 'CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段',
      },
      {
        displayName: '更新时间',
        name: 'updated_at',
        type: 'DateTime',
        dateFormatType: 'timestamp-ms',
        id: 'updated_at',
        isSystem: true,
        description: 'CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段',
      },
    ],
    description,
    created_at: Date.now(),
    updated_at: Date.now(),
  }
}

async function createSchemaApi(displayName, collectionName) {
  return {
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
  }
}

async function createSchemaPermission(displayName, collectionName) {
  return [
    { name: `pms.content.${collectionName}.menu`, label: `${displayName}菜单` },
    { name: `pms.content.${collectionName}.create`, label: `创建${displayName}` },
    { name: `pms.content.${collectionName}.read`, label: `读取${displayName}` },
    { name: `pms.content.${collectionName}.edit`, label: `编辑${displayName}` },
    { name: `pms.content.${collectionName}.delete`, label: `删除${displayName}` },
  ]
}

async function createSchemaRole(displayName, collectionName, permissions) {
  return {
    name: createRoleName(collectionName),
    label: createDisplayRoleName(displayName),
    description: '模型集合权限角色',
    permissions,
    status: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
  }
}

function createDisplayRoleName(displayName) {
  return `集合(${displayName})`;
}

function createRoleName(collectionName) {
  return `schema-${collectionName}`;
}

function createPms(collectionName) {
  return [
    `pms.content.${collectionName}.menu`,
    `pms.content.${collectionName}.create`,
    `pms.content.${collectionName}.read`,
    `pms.content.${collectionName}.edit`,
    `pms.content.${collectionName}.delete`
  ]
}

