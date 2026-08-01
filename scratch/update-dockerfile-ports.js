const fs = require('fs');
const path = require('path');

const ports = {
  gateway: 3010,
  auth: 3020,
  profile: 3030,
  organisation: 3040,
  verification: 3050,
  competency: 3060,
  assessment: 3070,
  commerce: 3080,
  execution: 3090,
  evaluation: 3100,
  learning: 3110,
  ai: 3120,
  integration: 3130,
  file: 3140,
  reporting: 3150,
  platform: 3160
};

const servicesDir = path.join(__dirname, '../services');

Object.entries(ports).forEach(([service, port]) => {
  const dockerfilePath = path.join(servicesDir, service, 'Dockerfile');
  if (!fs.existsSync(dockerfilePath)) return;

  let content = fs.readFileSync(dockerfilePath, 'utf8');
  // Replace EXPOSE 8080 or other values with EXPOSE port
  content = content.replace(/EXPOSE\s+\d+/g, `EXPOSE ${port}`);
  fs.writeFileSync(dockerfilePath, content, 'utf8');
  console.log(`Updated Dockerfile port for ${service} to ${port}`);
});
