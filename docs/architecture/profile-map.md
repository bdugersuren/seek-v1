# Docker Compose Profile Map

| Profile | Main services |
|---|---|
| Core | postgres, redis, rabbitmq, minio, auth, gateway |
| frontend | portal-web, mock assessment-web via dev override |
| assessment | assessment-web and business runtime services |
| ai | ollama, qdrant, ai |
| integration | integration |
| dmoj | dmoj-adapter |
| ctfd | ctfd-adapter |
| nextcloud | nextcloud-adapter |
| observability | otel, prometheus, grafana, loki, tempo |
| dev | adminer, mailpit, local tools |
