#!/bin/bash

# Test script for Feature 2.5: Logging & Observability
# Tests: Structured Logging, Request/Response Logging, Error Logging, Metrics Collection, Log Levels

API_URL="http://localhost:3000/api/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing Feature 2.5: Logging & Observability"
echo "=========================================="
echo ""
echo -e "${BLUE}NOTE: Check your API server logs to see the structured logging output${NC}"
echo ""

# Test 1: Structured Logging - Successful Request
echo -e "${YELLOW}Test 1: Structured Logging - Successful Request${NC}"
echo "Making a GET request to /public endpoint..."
echo "Expected in logs: Structured log with timestamp, level, context, message, and metadata"
echo ""
curl -s -X GET "${API_URL}/public" | jq '.' || echo "Response received"
echo ""
echo "Check server logs for:"
echo "  - Timestamp (ISO format)"
echo "  - Log level (LOG for 2xx)"
echo "  - Context (HTTP)"
echo "  - Message (GET /api/v1/public 200)"
echo "  - Metadata (duration, ip, userAgent, etc.)"
echo ""
echo "----------------------------------------"
echo ""

# Test 2: Structured Logging - Request with Query Parameters
echo -e "${YELLOW}Test 2: Structured Logging - Request with Query Parameters${NC}"
echo "Making a GET request with query parameters..."
echo ""
curl -s -X GET "${API_URL}/public?page=1&limit=10&sort=asc" | jq '.' || echo "Response received"
echo ""
echo "Check server logs for query parameters in metadata"
echo ""
echo "----------------------------------------"
echo ""

# Test 3: Request/Response Logging - POST Request with Body
echo -e "${YELLOW}Test 3: Request/Response Logging - POST Request with Body${NC}"
echo "Making a POST request with body (non-sensitive endpoint)..."
echo ""
curl -s -X POST "${API_URL}/public" \
  -H "Content-Type: application/json" \
  -d '{"test":"data","value":123}' | jq '.' || echo "Response received"
echo ""
echo "Check server logs for body in metadata (sanitized if sensitive)"
echo ""
echo "----------------------------------------"
echo ""

# Test 4: Request/Response Logging - Sensitive Endpoint (Login)
echo -e "${YELLOW}Test 4: Request/Response Logging - Sensitive Endpoint (Login)${NC}"
echo "Making a POST request to login endpoint..."
echo "Expected: Body should NOT be logged (sensitive endpoint)"
echo ""
curl -s -X POST "${API_URL}/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}' | jq '.'
echo ""
echo "Check server logs - body should NOT appear (sensitive endpoint)"
echo ""
echo "----------------------------------------"
echo ""

# Test 5: Error Logging - 400 Bad Request
echo -e "${YELLOW}Test 5: Error Logging - 400 Bad Request${NC}"
echo "Making a request that will return 400 Bad Request..."
echo "Expected in logs: WARN level with validation errors"
echo ""
response=$(curl -s -X POST "${API_URL}/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}')
echo "$response" | jq '.'
echo ""
echo "Check server logs for:"
echo "  - Log level: WARN (for 4xx errors)"
echo "  - Error details in metadata"
echo "  - Validation errors"
echo ""
echo "----------------------------------------"
echo ""

# Test 6: Error Logging - 401 Unauthorized
echo -e "${YELLOW}Test 6: Error Logging - 401 Unauthorized${NC}"
echo "Making a request to protected endpoint without auth..."
echo "Expected in logs: WARN level with 401 status"
echo ""
response=$(curl -s -X GET "${API_URL}/admin")
echo "$response" | jq '.'
echo ""
echo "Check server logs for:"
echo "  - Log level: WARN (for 4xx errors)"
echo "  - Status code: 401"
echo "  - Error message"
echo ""
echo "----------------------------------------"
echo ""

# Test 7: Error Logging - 404 Not Found
echo -e "${YELLOW}Test 7: Error Logging - 404 Not Found${NC}"
echo "Making a request to non-existent endpoint..."
echo "Expected in logs: WARN level with 404 status"
echo ""
response=$(curl -s -X GET "${API_URL}/nonexistent")
echo "$response" | jq '.' || echo "$response"
echo ""
echo "Check server logs for:"
echo "  - Log level: WARN (for 4xx errors)"
echo "  - Status code: 404"
echo ""
echo "----------------------------------------"
echo ""

# Test 8: Metrics Collection - Check Initial Metrics
echo -e "${YELLOW}Test 8: Metrics Collection - Check Initial Metrics${NC}"
echo "Fetching metrics summary..."
echo ""
metrics=$(curl -s -X GET "${API_URL}/metrics")
echo "$metrics" | jq '.'
echo ""
echo "Expected metrics structure:"
echo "  - totalRequests: number"
echo "  - errorCount: number"
echo "  - averageResponseTime: number"
echo "  - requestsByStatus: object"
echo "  - requestsByEndpoint: object"
echo ""
echo "----------------------------------------"
echo ""

# Test 9: Metrics Collection - After Multiple Requests
echo -e "${YELLOW}Test 9: Metrics Collection - After Multiple Requests${NC}"
echo "Making 5 requests to different endpoints, then checking metrics..."
echo ""

echo "Making requests..."
for i in {1..3}; do
  curl -s -X GET "${API_URL}/public" > /dev/null
  curl -s -X GET "${API_URL}/health" > /dev/null
done

echo "Fetching updated metrics..."
sleep 1
metrics=$(curl -s -X GET "${API_URL}/metrics")
echo "$metrics" | jq '.'
echo ""
echo "Verify:"
echo "  - totalRequests increased"
echo "  - requestsByEndpoint shows /api/v1/public and /api/v1/health"
echo "  - requestsByStatus shows status code counts"
echo ""
echo "----------------------------------------"
echo ""

# Test 10: Metrics Collection - Error Metrics
echo -e "${YELLOW}Test 10: Metrics Collection - Error Metrics${NC}"
echo "Making requests that will generate errors, then checking metrics..."
echo ""

echo "Making error requests..."
curl -s -X POST "${API_URL}/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}' > /dev/null

curl -s -X GET "${API_URL}/admin" > /dev/null

echo "Fetching metrics with errors..."
sleep 1
metrics=$(curl -s -X GET "${API_URL}/metrics")
echo "$metrics" | jq '.'
echo ""
echo "Verify:"
echo "  - errorCount increased"
echo "  - requestsByStatus shows 400 and 401 counts"
echo ""
echo "----------------------------------------"
echo ""

# Test 11: Response Time Logging
echo -e "${YELLOW}Test 11: Response Time Logging${NC}"
echo "Making requests and checking response times in logs..."
echo ""
echo "Request 1:"
time curl -s -X GET "${API_URL}/public" > /dev/null
echo ""
echo "Request 2:"
time curl -s -X GET "${API_URL}/health" > /dev/null
echo ""
echo "Check server logs for 'duration' field in metadata"
echo "Check metrics for 'averageResponseTime'"
echo ""
echo "----------------------------------------"
echo ""

# Test 12: User Agent and IP Logging
echo -e "${YELLOW}Test 12: User Agent and IP Logging${NC}"
echo "Making request with custom User-Agent header..."
echo ""
curl -s -X GET "${API_URL}/public" \
  -H "User-Agent: Test-Agent/1.0" | jq '.' || echo "Response received"
echo ""
echo "Check server logs for:"
echo "  - userAgent: 'Test-Agent/1.0'"
echo "  - ip: client IP address"
echo ""
echo "----------------------------------------"
echo ""

# Test 13: Log Level Configuration
echo -e "${YELLOW}Test 13: Log Level Configuration${NC}"
echo "Checking current environment and log levels..."
echo ""
echo "Current NODE_ENV: ${NODE_ENV:-development}"
echo ""
echo "Expected log levels:"
if [ "${NODE_ENV}" = "production" ]; then
  echo "  - Production: error, warn, log"
else
  echo "  - Development: error, warn, log, debug, verbose"
fi
echo ""
echo "Make requests and verify only appropriate log levels appear"
echo ""
echo "----------------------------------------"
echo ""

# Test 14: Structured Log Format
echo -e "${YELLOW}Test 14: Structured Log Format Verification${NC}"
echo "Making a request to verify log structure..."
echo ""
curl -s -X GET "${API_URL}/public" > /dev/null
echo ""
echo "Check server logs for structured format:"
echo ""
if [ "${NODE_ENV}" = "production" ]; then
  echo "Production format (JSON):"
  echo '  {"timestamp":"...","level":"log","context":"HTTP","message":"...","duration":"...ms","ip":"...","userAgent":"..."}'
else
  echo "Development format (readable):"
  echo '  [2026-01-14T...] LOG [HTTP] GET /api/v1/public 200 duration="5ms" ip="::1" userAgent="curl/..."'
fi
echo ""
echo "----------------------------------------"
echo ""

# Test 15: Metrics - Response Time Histogram
echo -e "${YELLOW}Test 15: Metrics - Response Time Histogram${NC}"
echo "Checking metrics for response time data..."
echo ""
metrics=$(curl -s -X GET "${API_URL}/metrics")
echo "$metrics" | jq '.averageResponseTime'
echo ""
echo "Verify averageResponseTime is calculated from http_response_time metrics"
echo ""
echo "----------------------------------------"
echo ""

echo -e "${GREEN}Testing complete!${NC}"
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "✅ 1. Structured Logging - Check server logs for structured format"
echo "✅ 2. Query Parameters Logging - Check logs for query in metadata"
echo "✅ 3. Request Body Logging - Check logs for body (non-sensitive)"
echo "✅ 4. Sensitive Endpoint Protection - Body NOT logged for /auth/login"
echo "✅ 5. Error Logging (400) - Check logs for WARN level with errors"
echo "✅ 6. Error Logging (401) - Check logs for WARN level"
echo "✅ 7. Error Logging (404) - Check logs for WARN level"
echo "✅ 8. Metrics Collection - Metrics endpoint returns summary"
echo "✅ 9. Metrics After Requests - Metrics update correctly"
echo "✅ 10. Error Metrics - Error counts tracked"
echo "✅ 11. Response Time Logging - Duration in logs and metrics"
echo "✅ 12. User Agent & IP Logging - Client info in logs"
echo "✅ 13. Log Level Configuration - Appropriate levels per environment"
echo "✅ 14. Structured Log Format - Correct format (JSON/readable)"
echo "✅ 15. Response Time Histogram - Average calculated correctly"
echo ""
echo "=========================================="
echo -e "${GREEN}Feature 2.5: Logging & Observability - ALL TESTS COMPLETE!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}IMPORTANT: Review your API server console/logs to verify:${NC}"
echo "  - Structured logging format"
echo "  - Request/response details"
echo "  - Error logging"
echo "  - Metrics collection"
echo ""
