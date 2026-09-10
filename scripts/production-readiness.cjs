// Docker readiness checks application HTTP and its durable dependencies.
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const timer = setTimeout(() => process.exit(1), 4500);
function probe(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, response => {
      response.resume();
      response.statusCode >= 200 && response.statusCode < 400 ? resolve() : reject(new Error('HTTP unavailable'));
    });
    request.on('error', reject);
    request.setTimeout(3000, () => request.destroy(new Error('timeout')));
  });
}
(async () => {
  await probe(`http://127.0.0.1:${process.env.PORT}/health/ready`);
  const serviceDir = process.env.SERVICE_DIR;
  const localRequire = createRequire(path.join(serviceDir, 'package.json'));
  if (process.env.DATABASE_URL || process.env.ASSESSMENT_DATABASE_URL || process.env.EXECUTION_DATABASE_URL) {
    const { PrismaClient } = serviceDir.endsWith('/auth') ? localRequire('@prisma/client') : localRequire('./generated/prisma-client');
    const prisma = new PrismaClient();
    try { await prisma.$queryRawUnsafe('SELECT 1'); } finally { await prisma.$disconnect(); }
  }
  if (serviceDir.endsWith('/gateway')) {
    await Promise.all(['AUTH','PROFILE','ORGANISATION','ASSESSMENT','EXECUTION','FILE','INTEGRATION'].map(name => probe(process.env[name + '_SERVICE_URL'] + '/health/ready')));
  }
  if (serviceDir.endsWith('/file')) {
    const { Client } = localRequire('minio');
    const endpoint = new URL(process.env.MINIO_ENDPOINT);
    const client = new Client({endPoint:endpoint.hostname,port:Number(endpoint.port || 9000),useSSL:endpoint.protocol==='https:',accessKey:process.env.MINIO_ACCESS_KEY,secretKey:process.env.MINIO_SECRET_KEY});
    if (!await client.bucketExists(process.env.MINIO_BUCKET)) throw new Error('Storage unavailable');
  }
  clearTimeout(timer);
})().catch(() => process.exit(1));
