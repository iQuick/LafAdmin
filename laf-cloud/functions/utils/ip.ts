import cloud from '@lafjs/cloud'


const ip_by_ipapi = async (ip: string) => {
  const rsp = await cloud.fetch.get(`http://ip-api.com/json/${ip}?lang=zh-CN`);
  const data = rsp.data;
  return {
    "region": `${data.country}${data.regionName}`,
    "lat": data.lat,
    "lon": data.lon,
    "isp": data.isp
  };
}

export default async function rip(ip: string) {
  return ip_by_ipapi(ip)
}


// export async function main(ctx: FunctionContext) {
//   return ip("115.191.200.34")
// }
