# Observability / Ажиглалт ба хяналт

## Stack

```text
OpenTelemetry
Prometheus
Grafana
Loki
Tempo
```

Every request and event carries correlationId, causationId, traceId, service, operation, outcome, duration, and allowed actor/subject identifiers.

Each service exposes:

```text
/health/live
/health/ready
```

Track request rate, p50/p95/p99, errors, active sessions, autosave rate/conflicts, submission rate, DB connections, Redis latency, queue lag, worker throughput, AI latency, DMOJ judge time, and CTFd sync delay.
