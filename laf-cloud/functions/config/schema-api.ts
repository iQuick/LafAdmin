import cloud from '@lafjs/cloud'

const db = cloud.database();

const innerSchemaApis = [{
  "displayName": "用户",
  "collectionName": "user",
  "enable": true,
  "apis": {
    "register": {
      "target": "api/user/register",
      "enable": true,
      "token": false,
      "tokenEdit": false,
      "displayName": "注册 / Register",
      "url": "/api/user/register",
      "method": "POST",
      "params": {},
      "body": {
        "username": "用户名（必填|String）",
        "nickname": "昵称（可选|String）",
        "password": "密码（必填|String）"
      },
      "collapse": true
    },
    "login": {
      "target": "api/user/login",
      "enable": true,
      "token": false,
      "tokenEdit": false,
      "displayName": "登录 / Login",
      "url": "/api/user/login",
      "method": "POST",
      "params": {},
      "body": {
        "username": "用户名（必填|String）",
        "password": "密码（必填|String）"
      },
      "collapse": false
    },
    "logout": {
      "target": "api/user/logout",
      "enable": true,
      "token": true,
      "tokenEdit": false,
      "displayName": "登出 / Logout",
      "url": "/api/user/logout",
      "method": "POST",
      "headers": {
        "Authorization": "Token(必填|String)"
      },
      "params": {},
      "body": {},
      "collapse": true
    },
    "refreshtoken": {
      "target": "api/user/refreshtoken",
      "enable": true,
      "token": true,
      "tokenEdit": false,
      "displayName": "刷新Token / RefreshToken",
      "url": "/api/user/refreshtoken",
      "method": "POST",
      "headers": {
        "Authorization": "Token(必填|String)"
      },
      "params": {},
      "body": {},
      "collapse": false
    },
    "resetpasswd": {
      "target": "api/user/resetpasswd",
      "enable": true,
      "token": true,
      "tokenEdit": false,
      "displayName": "修改密码 / ResetPassword",
      "url": "/api/user/resetpasswd",
      "method": "POST",
      "headers": {
        "Authorization": "Token(必填|String)"
      },
      "params": {},
      "body": {
        "oldpassword": "原密码（必填|String）",
        "newpassword": "新密码（必填|String）"
      },
      "collapse": false
    },
    "update": {
      "target": "api/user/update",
      "enable": true,
      "token": true,
      "tokenEdit": false,
      "displayName": "更新 / Update",
      "url": "/api/user/update",
      "method": "POST",
      "headers": {
        "Authorization": "Token(必填|String)"
      },
      "params": {},
      "body": {
        "nickname": "昵称(可选|String)",
        "avator": "头像(可选|String)",
        "phone": "手机号码(可选|String)",
        "email": "邮箱地址(可选|String)"
      },
      "collapse": false
    }
  },
  "created_at": Date.now(),
  "updated_at": Date.now()
}, {
  "displayName": "资源管理",
  "collectionName": "oss",
  "enable": true,
  "apis": {
    "upload": {
      "target": "api/oss/upload",
      "enable": true,
      "token": false,
      "tokenEdit": true,
      "displayName": "文件上传 / FileUpload",
      "url": "/api/oss/upload",
      "method": "POST",
      "headers": {
      },
      "params": {},
      "body": {
        "path": "保存路径(可选|String)",
        "file": "上传的文件"
      },
      "collapse": true
    },
    "delete": {
      "target": "api/oss/delete",
      "enable": true,
      "token": false,
      "tokenEdit": true,
      "displayName": "文件删除 / FileDelete",
      "url": "/api/oss/delete",
      "method": "POST",
      "headers": {},
      "params": {},
      "body": {
        "key": "文件 Key"
      },
      "collapse": true
    },
    "get-upload-link": {
      "target": "api/oss/get-upload-link",
      "enable": false,
      "token": false,
      "tokenEdit": true,
      "displayName": "获取上传链接 / GetUploadLink",
      "url": "/api/oss/get-upload-link",
      "method": "POST",
      "headers": {},
      "params": {},
      "body": {
        "path": "保持路径（可选|String）",
        "validity": "有效期（可选|int)",
        "filename": "文件名称"
      },
      "collapse": true
    }
  },
  "created_at": Date.now(),
  "updated_at": Date.now()
}];

// 创建初始集合接口
export default async function configSchemaApi() {
  await cloud.mongo.db.collection('schema-api').createIndex('collectionName', { unique: true });
  for (const api of innerSchemaApis) {
    try {
      const data = {
        ...api,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      await db.collection('schema-api').add(data);
    } catch (error) {
      if (error.code == 11000) {
        console.log('schema api already exists');
        continue;
      }
    }
  }
}
