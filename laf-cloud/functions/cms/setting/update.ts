import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import {
  INVALID_EMAIL,
  INVALID_SETTING,
  PARAMS_EMPTY_SITE_LOGO,
  PARAMS_EMPTY_SITE_NAME,
} from '@/system/fail';
import { EMAIL } from '@/utils/regex';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'system.setting.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { key } = ctx.body;
  if (key === 'basic') {
    const { name, logo, icpCode, mobile, address, loginCode, systemOpen, closeText } = ctx.body;
    if (!name) {
      return fail(PARAMS_EMPTY_SITE_NAME);
    }
    if (!logo) {
      return fail(PARAMS_EMPTY_SITE_LOGO);
    }
    const data = { name, logo, updated_at: Date.now() };
    if (icpCode) {
      data['icpCode'] = icpCode;
    }
    if (mobile) {
      data['mobile'] = mobile;
    }
    if (address) {
      data['address'] = address;
    }
    if (loginCode) {
      data['loginCode'] = loginCode;
    }
    if (systemOpen) {
      data['systemOpen'] = systemOpen;
    }
    if (closeText) {
      data['closeText'] = closeText;
    }

    const result = await db.collection('setting').where({ key }).update(data);
    return { code: 0, result };
  } else if (key === 'email') {
    const { emailAddr, smtpAddr, smtpPort, smtpName, smtpPassword } = ctx.body;
    const data = { updated_at: Date.now() };
    if (emailAddr) {
      if (!EMAIL.test(emailAddr)) {
        return fail(INVALID_EMAIL);
      }
      data['emailAddr'] = emailAddr;
    }
    if (smtpAddr) {
      data['smtpAddr'] = smtpAddr;
    }
    if (smtpPort) {
      data['smtpPort'] = smtpPort;
    }
    if (smtpName) {
      data['smtpName'] = smtpName;
    }
    if (smtpPassword) {
      data['smtpPassword'] = smtpPassword;
    }

    const result = await db.collection('setting').where({ key }).update(data);
    return ok(result);
  }
  return fail(INVALID_SETTING);
}
