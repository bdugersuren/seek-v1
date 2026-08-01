#!/bin/bash
set -e

echo "=== Wait for services to be ready ==="
sleep 5

echo "=== Testing Health Endpoints ==="
echo "Gateway Health:"
curl -s http://localhost:3000/health || echo "Failed to connect to Gateway"
echo -e "\nExecution Health:"
curl -s http://localhost:3080/health || echo "Failed to connect to Execution service"
echo -e "\n"

echo "=== Testing Proxy Routing via Gateway (GET /api/v1/execution/session/:id) ==="
SESSION_RESP=$(curl -s http://localhost:3000/api/v1/execution/session/mock-attempt-001)
echo "Session Response:"
echo "$SESSION_RESP"
echo -e "\n"

echo "=== Testing Heartbeat via Gateway (POST /api/v1/execution/heartbeat) ==="
HEARTBEAT_RESP=$(curl -s -X POST http://localhost:3000/api/v1/execution/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"attemptId": "mock-attempt-001", "clientNow": "2026-08-01T15:30:00Z", "localVersion": 1, "visible": true, "fullscreen": true}')
echo "Heartbeat Response:"
echo "$HEARTBEAT_RESP"
echo -e "\n"

echo "=== Testing Autosave via Gateway (POST /api/v1/execution/autosave) ==="
AUTOSAVE_RESP=$(curl -s -X POST http://localhost:3000/api/v1/execution/autosave \
  -H "Content-Type: application/json" \
  -d '{"attemptId": "mock-attempt-001", "idempotencyKey": "idem-key-1", "localVersion": 1, "changedAnswers": {"q1": "a"}, "clientSavedAt": "2026-08-01T15:30:05Z"}')
echo "Autosave Response:"
echo "$AUTOSAVE_RESP"
echo -e "\n"

echo "=== Testing Violation Record via Gateway (POST /api/v1/execution/violation) ==="
VIOLATION_RESP=$(curl -s -X POST http://localhost:3000/api/v1/execution/violation \
  -H "Content-Type: application/json" \
  -d '{"attemptId": "mock-attempt-001", "type": "window_blur", "occurredAt": "2026-08-01T15:30:10Z", "count": 1, "message": "Window blurred"}')
echo "Violation Response:"
echo "$VIOLATION_RESP"
echo -e "\n"

echo "=== Testing Heartbeat post-violation (to check warning count) ==="
HEARTBEAT_WARN_RESP=$(curl -s -X POST http://localhost:3000/api/v1/execution/heartbeat \
  -H "Content-Type: application/json" \
  -d '{"attemptId": "mock-attempt-001", "clientNow": "2026-08-01T15:30:15Z", "localVersion": 2, "visible": true, "fullscreen": true}')
echo "Heartbeat post-violation Response:"
echo "$HEARTBEAT_WARN_RESP"
echo -e "\n"

echo "=== Testing Submit via Gateway (POST /api/v1/execution/submit) ==="
SUBMIT_RESP=$(curl -s -X POST http://localhost:3000/api/v1/execution/submit \
  -H "Content-Type: application/json" \
  -d '{"attemptId": "mock-attempt-001", "idempotencyKey": "idem-key-submit", "submittedAt": "2026-08-01T15:35:00Z", "reason": "user_submit", "finalSnapshot": {"attemptId": "mock-attempt-001", "answers": {"q1": "a", "q2": ["a", "b"], "q3": "Essay answer content"}, "markedForReview": {}, "localVersion": 3, "serverVersion": 2, "pendingSubmit": false}}')
echo "Submit Response:"
echo "$SUBMIT_RESP"
echo -e "\n"

echo "=== Test Completed ==="
