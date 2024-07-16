import cloud from '@lafjs/cloud'

const db = cloud.database();

const sysEmail = {
  key: "email",
  emailAddr: '',
  smtpAddr: '',
  smtpPort: '',
  smtpName: '',
  smtpPassword: '',
}

const sysSetting = {
  key: 'basic',
  name: 'LafCms',
  logo: ['https://laf.run/logo.png'],
  icpCode: '',
  mobile: '',
  address: '',
  loginCode: '',
  systemOpen: true,
  closeText: '网站维护中...',
}

export default async function configSetting() {
  await cloud.mongo.db.collection('setting').createIndex('key', { unique: true });
  try {
    db.collection('setting').add(sysEmail);
  } catch (err) {
    console.log("Error sysEmail already exists");
  }
  try {
    db.collection('setting').add(sysSetting);
  } catch (err) {
    console.log("Error sysSetting already exists");
  }
}
