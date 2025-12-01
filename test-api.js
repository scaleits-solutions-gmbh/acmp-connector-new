#!/usr/bin/env node

/**
 * ACMP Connector API Test Script
 * Tests all endpoints including by-id endpoints
 */

const BASE_URL = 'http://51.89.105.199:3080';
const API_KEY = 'O9CL8-AHYSYB_t7s4fFY0S9ZbqoRr8u5';

// Test IDs gathered from API responses
const TEST_IDS = {
  clientId: '17162905-5E66-499A-87EA-9AED5971A128',
  clientCommandId: '{A3F403AA-8428-42B7-8493-D3F86715EF00}',
  rolloutTemplateId: '30368D93-F51D-4B91-95B6-702B596CC245',
};

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

async function testEndpoint(name, method, path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const fetchOptions = {
      method,
      headers,
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    logInfo(`Testing ${method} ${path}...`);
    
    const response = await fetch(url, fetchOptions);
    const status = response.status;
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (status >= 200 && status < 300) {
      logSuccess(`${name} - Status: ${status}`);
      if (options.verbose) {
        console.log(JSON.stringify(data, null, 2));
      }
      return { success: true, status, data };
    } else {
      logError(`${name} - Status: ${status}`);
      if (data) {
        console.error(JSON.stringify(data, null, 2));
      }
      return { success: false, status, data };
    }
  } catch (error) {
    logError(`${name} - Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('ACMP Connector API Test Suite', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  // Health check (no auth required)
  log('\n--- Health Check ---', colors.yellow);
  results.total++;
  const healthResult = await testEndpoint('Health Check', 'GET', '/health');
  if (healthResult.success) results.passed++;
  else results.failed++;

  // Clients
  log('\n--- Clients ---', colors.yellow);
  results.total++;
  const clientsResult = await testEndpoint(
    'Get Clients',
    'GET',
    '/api/clients?page=1&pageSize=10'
  );
  if (clientsResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const clientByIdResult = await testEndpoint(
    'Get Client By ID',
    'GET',
    `/api/clients/${TEST_IDS.clientId}`
  );
  if (clientByIdResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const clientHardDrivesResult = await testEndpoint(
    'Get Client Hard Drives',
    'GET',
    `/api/clients/${TEST_IDS.clientId}/hard-drives?page=1&pageSize=10`
  );
  if (clientHardDrivesResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const clientNetworkCardsResult = await testEndpoint(
    'Get Client Network Cards',
    'GET',
    `/api/clients/${TEST_IDS.clientId}/network-cards?page=1&pageSize=10`
  );
  if (clientNetworkCardsResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const clientInstalledSoftwareResult = await testEndpoint(
    'Get Client Installed Software',
    'GET',
    `/api/clients/${TEST_IDS.clientId}/installed-software?page=1&pageSize=10`
  );
  if (clientInstalledSoftwareResult.success) results.passed++;
  else results.failed++;

  // Client Commands
  log('\n--- Client Commands ---', colors.yellow);
  results.total++;
  const clientCommandsResult = await testEndpoint(
    'Get Client Commands',
    'GET',
    '/api/client-commands?page=1&pageSize=10'
  );
  if (clientCommandsResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const clientCommandByIdResult = await testEndpoint(
    'Get Client Command By ID',
    'GET',
    `/api/client-commands/${encodeURIComponent(TEST_IDS.clientCommandId)}`
  );
  if (clientCommandByIdResult.success) results.passed++;
  else results.failed++;

  // Jobs
  log('\n--- Jobs ---', colors.yellow);
  results.total++;
  const jobsResult = await testEndpoint(
    'Get Jobs',
    'GET',
    '/api/jobs?page=1&pageSize=10'
  );
  if (jobsResult.success) results.passed++;
  else results.failed++;

  // Note: Job by-id endpoint not exposed via Fastify routes

  // Tickets
  log('\n--- Tickets ---', colors.yellow);
  results.total++;
  const ticketsResult = await testEndpoint(
    'Get Tickets',
    'GET',
    '/api/tickets?page=1&pageSize=10'
  );
  if (ticketsResult.success) results.passed++;
  else results.failed++;

  // Note: Ticket by-id test skipped as no tickets available

  // Assets
  log('\n--- Assets ---', colors.yellow);
  results.total++;
  const assetsResult = await testEndpoint(
    'Get Assets',
    'GET',
    '/api/assets?page=1&pageSize=10'
  );
  if (assetsResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const assetTypesResult = await testEndpoint(
    'Get Asset Types',
    'GET',
    '/api/assets/types'
  );
  if (assetTypesResult.success) results.passed++;
  else results.failed++;

  // Note: Asset by-id test skipped as no assets available

  // Rollout Templates
  log('\n--- Rollout Templates ---', colors.yellow);
  results.total++;
  const rolloutTemplatesResult = await testEndpoint(
    'Get Rollout Templates',
    'GET',
    '/api/rollout-templates?page=1&pageSize=10'
  );
  if (rolloutTemplatesResult.success) results.passed++;
  else results.failed++;

  results.total++;
  const rolloutTemplateByIdResult = await testEndpoint(
    'Get Rollout Template By ID',
    'GET',
    `/api/rollout-templates/${TEST_IDS.rolloutTemplateId}`
  );
  if (rolloutTemplateByIdResult.success) results.passed++;
  else results.failed++;

  // Summary
  log('\n' + '='.repeat(60), colors.cyan);
  log('Test Summary', colors.cyan);
  log('='.repeat(60), colors.cyan);
  log(`Total Tests: ${results.total}`, colors.blue);
  log(`Passed: ${results.passed}`, colors.green);
  log(`Failed: ${results.failed}`, colors.red);
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 
    results.failed === 0 ? colors.green : colors.yellow);
  log('='.repeat(60) + '\n', colors.cyan);

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  logError('This script requires Node.js 18+ or a fetch polyfill');
  logInfo('Install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch((error) => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});

