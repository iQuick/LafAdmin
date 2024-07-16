
const my_headers = [
  "host",
  "x-request-id",
  "x-real-ip",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
  "x-forwarded-scheme",
  "x-scheme",
  "sec-ch-ua",
  "accept",
  "x-laf-debug-data",
  "x-laf-develop-token",
  "sec-ch-ua-mobile",
  "user-agent",
  "sec-ch-ua-platform",
  "origin",
  "sec-fetch-site",
  "sec-fetch-mode",
  "sec-fetch-dest",
  "referer",
  "accept-encoding",
  "accept-language",
  "if-none-match",
  "priority",
  "cache-control",
  "upgrade-insecure-requests",
  "sec-fetch-user",
  "cookie",
  "content-length"
];

export default function filter_headers(headers) {
  const new_headers = JSON.parse(JSON.stringify(headers))
  my_headers.forEach(property => {
    if (new_headers[property]) {
      delete new_headers[property];
    }
  });
  return new_headers;
}