import cloud from '@lafjs/cloud'

const db = cloud.database();

const innerSchemas = [
  {
    "displayName": "User",
    "collectionName": "user",
    "system": true,
    "fields": [
      {
        "displayName": "用户名",
        "name": "username"
      },
      {
        "displayName": "昵称",
        "name": "nickname"
      },
      {
        "displayName": "头像",
        "name": "avator"
      },
      {
        "displayName": "手机号",
        "name": "phone"
      },
      {
        "displayName": "邮箱",
        "name": "email"
      }
    ],
    "description": ""
  },
  {
    "displayName": "用户Token",
    "collectionName": "user-token",
    "system": true,
    "fields": [
      {
        "displayName": "创建时间",
        "name": "created_at",
        "type": "DateTime",
        "dateFormatType": "timestamp-ms",
        "id": "created_at",
        "isSystem": true,
        "description": "CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段"
      },
      {
        "displayName": "更新时间",
        "name": "updated_at",
        "type": "DateTime",
        "dateFormatType": "timestamp-ms",
        "id": "updated_at",
        "isSystem": true,
        "description": "CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段"
      },
      {
        "displayName": "用户",
        "name": "uid",
        "description": "",
        "isRequired": true,
        "isHidden": false,
        "isOrderField": false,
        "defaultValue": null,
        "connectResource": "64ae2e438c6deecf4d1337b6",
        "connectCollection": "user",
        "connectField": "username",
        "id": "wxxkSibEtExv83ddh3tG1",
        "type": "Connect"
      },
      {
        "displayName": "Token",
        "name": "token",
        "description": "",
        "isRequired": true,
        "isHidden": false,
        "isOrderField": false,
        "defaultValue": "",
        "id": "LsCoOOXZ0mRkfPx3amkEN",
        "type": "String"
      },
      {
        "displayName": "过期时间",
        "name": "expired_at",
        "description": "",
        "isRequired": true,
        "isHidden": false,
        "isOrderField": false,
        "defaultValue": 1689304008750,
        "dateFormatType": "timestamp-ms",
        "id": "jmdvzSAWR8SBIDTqyAsth",
        "type": "DateTime"
      }
    ],
    "description": ""
  }
]

// 创建初始内置集合
export default async function configSchema() {
  await cloud.mongo.db.collection('schema').createIndex('collectionName', { unique: true });
  for (const schema of innerSchemas) {
    try {
      const data = {
        ...schema,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      await db.collection('schema').add(data);
    } catch (error) {
      if (error.code == 11000) {
        console.log('schema already exists');
        continue;
      }
    }
  }
}
