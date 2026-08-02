const fs = require("fs");
const sqlite3 = require("sqlite3");

const hosts = [
  ["portal.seek.mn", "portal-web", 8081],
  ["quiz.seek.mn", "assessment-web", 8082],
  ["bank.seek.mn", "commerce", 3080],
  ["quiz-api.seek.mn", "gateway", 3010],
  ["auth-api.seek.mn", "auth", 3020],
  ["profile-api.seek.mn", "profile", 3030],
  ["org-api.seek.mn", "organisation", 3040],
  ["verify-api.seek.mn", "verification", 3050],
  ["competency-api.seek.mn", "competency", 3060],
  ["assess-api.seek.mn", "assessment", 3070],
  ["bank-api.seek.mn", "commerce", 3080],
  ["exec-api.seek.mn", "execution", 3090],
  ["eval-api.seek.mn", "evaluation-worker", 3100],
  ["learn-api.seek.mn", "learning", 3110],
  ["ai-api.seek.mn", "ai", 3120],
  ["integration-api.seek.mn", "integration", 3130],
  ["file-api.seek.mn", "file", 3140],
  ["report-api.seek.mn", "reporting", 3150],
  ["platform-api.seek.mn", "platform", 3160],
  ["oj.seek.mn", "execution", 3090],
  ["ctf.seek.mn", "execution", 3090],
  ["lms.seek.mn", "portal-web", 8081],
];

const db = new sqlite3.Database("/data/database.sqlite");
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function proxyConfig(id, domain, host, port) {
  return `# ------------------------------------------------------------
# ${domain}
# ------------------------------------------------------------



map $scheme $hsts_header {
    https   "max-age=63072000; preload";
}

server {
  set $forward_scheme http;
  set $server         "${host}";
  set $port           ${port};

  listen 80;
listen [::]:80;


  server_name ${domain};
http2 off;











proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $http_connection;
proxy_http_version 1.1;


  access_log /data/logs/proxy-host-${id}_access.log proxy;
  error_log /data/logs/proxy-host-${id}_error.log warn;







  location / {







    
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_http_version 1.1;
    

    # Proxy!
    include conf.d/include/proxy.conf;
  }


  # Custom
  include /data/nginx/custom/server_proxy[.]conf;
}
`;
}

async function upsertProxyHost(domain, host, port) {
  const domainNames = JSON.stringify([domain]);
  let row = await get(
    "select id from proxy_host where is_deleted = 0 and domain_names = ?",
    [domainNames]
  );

  if (row) {
    await run(
      "update proxy_host set modified_on = ?, forward_host = ?, forward_port = ?, forward_scheme = 'http', enabled = 1, allow_websocket_upgrade = 1, meta = ? where id = ?",
      [
        now(),
        host,
        port,
        JSON.stringify({ nginx_online: true, nginx_err: null }),
        row.id,
      ]
    );
  } else {
    const result = await run(
      `insert into proxy_host (
        created_on, modified_on, owner_user_id, is_deleted, domain_names,
        forward_host, forward_port, access_list_id, certificate_id, ssl_forced,
        caching_enabled, block_exploits, advanced_config, meta,
        allow_websocket_upgrade, http2_support, forward_scheme, enabled,
        locations, hsts_enabled, hsts_subdomains, trust_forwarded_proto
      ) values (?, ?, 1, 0, ?, ?, ?, 0, 0, 0, 0, 0, '', ?, 1, 0, 'http', 1, '[]', 0, 0, 0)`,
      [
        now(),
        now(),
        domainNames,
        host,
        port,
        JSON.stringify({ nginx_online: true, nginx_err: null }),
      ]
    );
    row = { id: result.lastID };
  }

  fs.writeFileSync(
    `/data/nginx/proxy_host/${row.id}.conf`,
    proxyConfig(row.id, domain, host, port)
  );
  console.log(`${domain} -> ${host}:${port} (#${row.id})`);
}

async function main() {
  for (const [domain, host, port] of hosts) {
    await upsertProxyHost(domain, host, port);
  }
}

main()
  .then(() => db.close())
  .catch((error) => {
    console.error(error);
    db.close();
    process.exit(1);
  });
