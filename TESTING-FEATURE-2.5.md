# Testing Feature 2.5: Logging & Observability

This guide provides curl commands to test all aspects of Feature 2.5.

## Prerequisites

- API should be running on `http://localhost:3000` (default)
- `jq` installed for JSON formatting (optional but recommended)
- **IMPORTANT**: Keep your API server console/logs visible to see the logging output

## Quick Test

Run the comprehensive test script:

```bash
./test-feature-2.5.sh
```

## Manual Testing

### 1. Structured Logging - Successful Request

Test that successful requests are logged with structured format:

```bash
curl -X GET http://localhost:3000/api/v1/public
```

**Check server logs for:**

- Timestamp (ISO format)
- Log level: `LOG` (for 2xx responses)
- Context: `HTTP`
- Message: `GET /api/v1/public 200`
- Metadata: duration, ip, userAgent, etc.

**Expected log format (development):**

```
[2026-01-14T...] LOG [HTTP] GET /api/v1/public 200 duration="5ms" ip="::1" userAgent="curl/..."
```

**Expected log format (production - JSON):**

```json
{
  "timestamp": "2026-01-14T...",
  "level": "log",
  "context": "HTTP",
  "message": "GET /api/v1/public 200",
  "duration": "5ms",
  "ip": "::1",
  "userAgent": "curl/..."
}
```

---

### 2. Request with Query Parameters

Test that query parameters are logged:

```bash
curl -X GET "http://localhost:3000/api/v1/public?page=1&limit=10&sort=asc"
```

**Check server logs for:**

- `query` field in metadata with query parameters

---

### 3. Request Body Logging (Non-Sensitive)

Test that request bodies are logged for non-sensitive endpoints:

```bash
curl -X POST http://localhost:3000/api/v1/public \
  -H "Content-Type: application/json" \
  -d '{"test":"data","value":123}'
```

**Check server logs for:**

- `body` field in metadata (sanitized if contains sensitive fields)

---

### 4. Sensitive Endpoint Protection

Test that request bodies are NOT logged for sensitive endpoints:

```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

**Check server logs:**

- Body should NOT appear in logs (sensitive endpoint protection)

---

### 5. Error Logging - 400 Bad Request

Test that validation errors are logged at WARN level:

```bash
curl -X POST http://localhost:3000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}'
```

**Check server logs for:**

- Log level: `WARN` (for 4xx errors)
- Error details in metadata
- Validation errors array

**Expected response:**

```json
{
  "statusCode": 400,
  "timestamp": "...",
  "path": "/api/v1/admin/auth/login",
  "method": "POST",
  "message": "...",
  "errors": [...]
}
```

---

### 6. Error Logging - 401 Unauthorized

Test that authentication errors are logged:

```bash
curl -X GET http://localhost:3000/api/v1/admin
```

**Check server logs for:**

- Log level: `WARN`
- Status code: 401
- Error message

**Expected response:**

```json
{
  "statusCode": 401,
  "timestamp": "...",
  "path": "/api/v1/admin",
  "method": "GET",
  "message": "Invalid or expired token"
}
```

---

### 7. Error Logging - 404 Not Found

Test that 404 errors are logged:

```bash
curl -X GET http://localhost:3000/api/v1/nonexistent
```

**Check server logs for:**

- Log level: `WARN`
- Status code: 404

---

### 8. Metrics Collection

Test the metrics endpoint:

```bash
curl -X GET http://localhost:3000/api/v1/metrics
```

**Expected response:**

```json
{
  "totalRequests": 10,
  "errorCount": 2,
  "averageResponseTime": 15,
  "requestsByStatus": {
    "200": 8,
    "400": 1,
    "401": 1
  },
  "requestsByEndpoint": {
    "/api/v1/public": 5,
    "/api/v1/admin": 2,
    "/api/v1/admin/auth/login": 3
  }
}
```

---

### 9. Metrics After Multiple Requests

Make several requests, then check metrics:

```bash
# Make some requests
for i in {1..5}; do
  curl -s -X GET http://localhost:3000/api/v1/public > /dev/null
  curl -s -X GET http://localhost:3000/api/v1/health > /dev/null
done

# Check metrics
curl -X GET http://localhost:3000/api/v1/metrics | jq '.'
```

**Verify:**

- `totalRequests` increased
- `requestsByEndpoint` shows the endpoints you called
- `requestsByStatus` shows status code counts

---

### 10. Error Metrics Tracking

Make requests that generate errors, then check metrics:

```bash
# Generate some errors
curl -s -X POST http://localhost:3000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}' > /dev/null

curl -s -X GET http://localhost:3000/api/v1/admin > /dev/null

# Check metrics
curl -X GET http://localhost:3000/api/v1/metrics | jq '.'
```

**Verify:**

- `errorCount` increased
- `requestsByStatus` shows 400 and 401 counts

---

### 11. Response Time Logging

Test that response times are logged and tracked:

```bash
# Make a request and check logs for duration
curl -X GET http://localhost:3000/api/v1/public

# Check metrics for average response time
curl -X GET http://localhost:3000/api/v1/metrics | jq '.averageResponseTime'
```

**Check server logs for:**

- `duration` field in metadata (e.g., `duration="5ms"`)

**Check metrics for:**

- `averageResponseTime` calculated from all requests

---

### 12. User Agent and IP Logging

Test that client information is logged:

```bash
curl -X GET http://localhost:3000/api/v1/public \
  -H "User-Agent: Test-Agent/1.0"
```

**Check server logs for:**

- `userAgent: "Test-Agent/1.0"`
- `ip: "::1"` (or your client IP)

---

### 13. Log Level Configuration

Test that log levels are appropriate for environment:

**Development (default):**

- Should log: `error`, `warn`, `log`, `debug`, `verbose`

**Production:**

- Should log: `error`, `warn`, `log` only

**Test:**

```bash
# Check current environment
echo $NODE_ENV

# Make requests and verify only appropriate levels appear in logs
curl -X GET http://localhost:3000/api/v1/public
curl -X GET http://localhost:3000/api/v1/nonexistent
```

---

### 14. Structured Log Format Verification

Verify the log format matches the environment:

**Development format (readable):**

```
[2026-01-14T17:30:00.000Z] LOG [HTTP] GET /api/v1/public 200 duration="5ms" ip="::1" userAgent="curl/7.68.0"
```

**Production format (JSON):**

```json
{
  "timestamp": "2026-01-14T17:30:00.000Z",
  "level": "log",
  "context": "HTTP",
  "message": "GET /api/v1/public 200",
  "duration": "5ms",
  "ip": "::1",
  "userAgent": "curl/7.68.0"
}
```

---

### 15. Body Sanitization in Logs

Test that sensitive fields are redacted in logs:

```bash
curl -X POST http://localhost:3000/api/v1/public \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123","token":"abc123"}'
```

**Check server logs:**

- If body is logged, `password`, `token`, `refreshToken`, `accessToken` should be `***REDACTED***`

---

## Expected Results Summary

### ✅ Structured Logging

- All logs have structured format
- Timestamp, level, context, message present
- Metadata includes duration, ip, userAgent

### ✅ Request/Response Logging

- All requests logged with full details
- Query parameters logged
- Request bodies logged (except sensitive endpoints)
- Response times logged

### ✅ Error Logging

- 4xx errors logged at WARN level
- 5xx errors logged at ERROR level
- Error details and stack traces included
- Error metrics tracked

### ✅ Metrics Collection

- Metrics endpoint returns summary
- Total requests tracked
- Error count tracked
- Average response time calculated
- Requests grouped by status code
- Requests grouped by endpoint

### ✅ Log Levels

- Appropriate levels per environment
- Development: all levels
- Production: error, warn, log only

### ✅ Security

- Sensitive endpoints don't log body
- Sensitive fields redacted in logs
- Health checks skipped in production

---

## Troubleshooting

**If logs don't appear:**

- Check that `LoggingInterceptor` is registered as `APP_INTERCEPTOR`
- Verify `LoggerMiddleware` is applied
- Check log levels configuration

**If metrics don't update:**

- Verify `metricsCollector` is imported and used
- Check that interceptor and filter are recording metrics
- Wait a moment after requests before checking metrics

**If structured format is wrong:**

- Check `NODE_ENV` environment variable
- Verify `formatLogEntry` function logic
- Check `isProduction` flag in interceptor/filter

---

## Next Steps

Feature 2.5 is complete when:

- ✅ All requests are logged with structured format
- ✅ Errors are logged with appropriate levels
- ✅ Metrics are collected and accessible via endpoint
- ✅ Log levels are configured per environment
- ✅ Sensitive data is protected in logs
