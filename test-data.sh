#!/bin/bash
# Quick script to add sample posture data for testing

echo "🧪 Adding sample posture data..."

# Add data for today
curl -X POST http://localhost:8080/api/posture/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo-user"
  }' \
  -s | python3 -m json.tool

echo ""
echo "✅ Session started! Now adding some sample data..."
echo ""

# Simulate a 60-second recording with good posture
SESSION_ID=$(curl -X POST http://localhost:8080/api/posture/start \
  -H "Content-Type: application/json" \
  -d '{"userId": "demo-user"}' -s | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['_id'])")

echo "Session ID: $SESSION_ID"

# Update with good posture (45 seconds worth)
for i in {1..9}; do
  curl -X POST http://localhost:8080/api/posture/update \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"demo-user\",
      \"sessionId\": \"$SESSION_ID\",
      \"sessionIndex\": 0,
      \"isGoodPosture\": true,
      \"violationType\": null
    }" -s > /dev/null
  echo "Added 5s good posture ($i/9)"
done

# Update with bad posture (15 seconds worth)
for i in {1..3}; do
  curl -X POST http://localhost:8080/api/posture/update \
    -H "Content-Type: application/json" \
    -d "{
      \"userId\": \"demo-user\",
      \"sessionId\": \"$SESSION_ID\",
      \"sessionIndex\": 0,
      \"isGoodPosture\": false,
      \"violationType\": \"slouch\"
    }" -s > /dev/null
  echo "Added 5s bad posture (slouch) ($i/3)"
done

# Stop the session
curl -X POST http://localhost:8080/api/posture/stop \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"demo-user\",
    \"sessionId\": \"$SESSION_ID\",
    \"sessionIndex\": 0
  }" -s | python3 -m json.tool

echo ""
echo "✅ Sample data added!"
echo "📊 Check your Data section to see the graphs!"
echo ""
echo "Expected results:"
echo "  - Good posture: 75% (45 seconds)"
echo "  - Bad posture: 25% (15 seconds)"
echo "  - Total time: 60 seconds"
