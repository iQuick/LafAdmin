import configSetting from '@/config/setting';
import configRole from '@/config/role';
import configPermission from '@/config/permission';
import configAdmin from '@/config/admin';
import configSchema from '@/config/schema';
import configSchemaApi from '@/config/schema-api';


export default async function configs() {
  await configSetting()
  await configPermission()
  await configRole()
  await configAdmin()
  await configSchema()
  await configSchemaApi()
  return "ok";
}


