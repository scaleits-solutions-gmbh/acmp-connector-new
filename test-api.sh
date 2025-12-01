#!/bin/bash

# ACMP Connector API Test Script (curl-based)
# Tests all endpoints including by-id endpoints

BASE_URL="http://51.89.105.199:3080"
API_KEY="O9CL8-AHYSYB_t7s4fFY0S9ZbqoRr8u5"

# Test IDs gathered from API responses
CLIENT_ID="17162905-5E66-499A-87EA-9AED5971A128"
CLIENT_COMMAND_ID="{A3F403AA-8428-42B7-8493-D3F86715EF00}"
ROLLOUT_TEMPLATE_ID="30368D93-F51D-4B91-95B6-702B596CC245"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
TOTAL=0

test_endpoint() {
  local name=$1
  local method=$2
  local path=$3
  local body=$4
  
  TOTAL=$((TOTAL + 1))
  
  echo -e "${BLUE}Testing ${method} ${path}...${NC}"
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET \
      -H "x-api-key: ${API_KEY}" \
      -H "Content-Type: application/json" \
      "${BASE_URL}${path}")
  else
    response=$(curl -s -w "\n%{http_code}" -X POST \
      -H "x-api-key: ${API_KEY}" \
      -H "Content-Type: application/json" \
      -d "${body}" \
      "${BASE_URL}${path}")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo -e "${GREEN}✓ ${name} - Status: ${http_code}${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ ${name} - Status: ${http_code}${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}ACMP Connector API Test Suite${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Health check (no auth required)
echo -e "${YELLOW}--- Health Check ---${NC}"
test_endpoint "Health Check" "GET" "/health"

# Clients
echo -e "\n${YELLOW}--- Clients ---${NC}"
test_endpoint "Get Clients" "GET" "/api/clients?page=1&pageSize=10"
test_endpoint "Get Client By ID" "GET" "/api/clients/${CLIENT_ID}"
test_endpoint "Get Client Hard Drives" "GET" "/api/clients/${CLIENT_ID}/hard-drives?page=1&pageSize=10"
test_endpoint "Get Client Network Cards" "GET" "/api/clients/${CLIENT_ID}/network-cards?page=1&pageSize=10"
test_endpoint "Get Client Installed Software" "GET" "/api/clients/${CLIENT_ID}/installed-software?page=1&pageSize=10"

# Client Commands
echo -e "\n${YELLOW}--- Client Commands ---${NC}"
test_endpoint "Get Client Commands" "GET" "/api/client-commands?page=1&pageSize=10"
# URL encode the client command ID (it contains curly braces)
CLIENT_COMMAND_ID_ENCODED=$(printf '%s' "$CLIENT_COMMAND_ID" | sed 's/{/%7B/g; s/}/%7D/g')
test_endpoint "Get Client Command By ID" "GET" "/api/client-commands/${CLIENT_COMMAND_ID_ENCODED}"

# Jobs
echo -e "\n${YELLOW}--- Jobs ---${NC}"
test_endpoint "Get Jobs" "GET" "/api/jobs?page=1&pageSize=10"
# Note: Job by-id endpoint not exposed via Fastify routes

# Tickets
echo -e "\n${YELLOW}--- Tickets ---${NC}"
test_endpoint "Get Tickets" "GET" "/api/tickets?page=1&pageSize=10"

# Assets
echo -e "\n${YELLOW}--- Assets ---${NC}"
test_endpoint "Get Assets" "GET" "/api/assets?page=1&pageSize=10"
test_endpoint "Get Asset Types" "GET" "/api/assets/types"

# Rollout Templates
echo -e "\n${YELLOW}--- Rollout Templates ---${NC}"
test_endpoint "Get Rollout Templates" "GET" "/api/rollout-templates?page=1&pageSize=10"
test_endpoint "Get Rollout Template By ID" "GET" "/api/rollout-templates/${ROLLOUT_TEMPLATE_ID}"

# Summary
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}Test Summary${NC}"
echo -e "${CYAN}============================================================${NC}"
echo -e "${BLUE}Total Tests: ${TOTAL}${NC}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"

if [ $FAILED -eq 0 ]; then
  success_rate="100.0"
  echo -e "${GREEN}Success Rate: ${success_rate}%${NC}"
  exit 0
else
  success_rate=$(awk "BEGIN {printf \"%.1f\", ($PASSED/$TOTAL)*100}")
  echo -e "${YELLOW}Success Rate: ${success_rate}%${NC}"
  exit 1
fi

