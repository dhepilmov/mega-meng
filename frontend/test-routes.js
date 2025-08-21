#!/usr/bin/env node

/**
 * Route Tester for Mega Meng Frontend
 * Tests all routes to ensure they're working properly
 */

import { spawn } from 'child_process';
import http from 'http';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, { timeout: 2000 }, (res) => {
      resolve({ port, status: res.statusCode, available: true });
    });
    
    req.on('error', () => resolve({ port, available: false }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ port, available: false });
    });
  });
}

function testRoute(port, route) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}${route}`, { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ 
          route, 
          status: res.statusCode, 
          success: res.statusCode === 200,
          hasTitle: data.includes('<title>'),
          hasYuzha: data.includes('Yuzha'),
          hasWarungMeng: data.includes('WarungMeng') || data.includes('MAINTENANCE')
        });
      });
    });
    
    req.on('error', (error) => resolve({ route, success: false, error: error.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ route, success: false, error: 'timeout' });
    });
  });
}

async function main() {
  log('🧪 MEGA MENG ROUTE TESTER', 'bright');
  log('=' .repeat(50), 'blue');
  
  // Test build exists
  try {
    const fs = await import('fs');
    if (fs.existsSync('build/index.html')) {
      log('✅ Build directory exists', 'green');
    } else {
      log('❌ Build directory missing - running build...', 'yellow');
      const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
      await new Promise((resolve, reject) => {
        buildProcess.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Build failed with code ${code}`));
        });
      });
    }
  } catch (error) {
    log('❌ Build check failed', 'red');
    return;
  }
  
  // Check available ports
  log('\n🔍 Checking available ports...', 'blue');
  const ports = [3000, 3001, 3002, 3003, 5000, 5001];
  const portResults = await Promise.all(ports.map(checkPort));
  
  const availablePorts = portResults.filter(r => r.available);
  const unavailablePorts = portResults.filter(r => !r.available);
  
  log(`📊 Port Status:`, 'yellow');
  availablePorts.forEach(p => log(`  ✅ Port ${p.port} - Server running (${p.status || 'unknown'})`, 'green'));
  unavailablePorts.forEach(p => log(`  ❌ Port ${p.port} - Not available`, 'red'));
  
  if (availablePorts.length === 0) {
    log('\n❌ No servers detected running!', 'red');
    log('💡 Try running: npm run dev (in another terminal)', 'yellow');
    return;
  }
  
  // Test routes on available ports
  log('\n🧪 Testing routes on available servers...', 'blue');
  const routes = ['/', '/yuzha', '/warungmeng'];
  
  for (const { port } of availablePorts) {
    log(`\n📡 Testing port ${port}:`, 'yellow');
    
    for (const route of routes) {
      const result = await testRoute(port, route);
      
      if (result.success) {
        let routeType = '';
        if (result.hasYuzha) routeType = ' (Yuzha App)';
        else if (result.hasWarungMeng) routeType = ' (WarungMeng)';
        else if (result.hasTitle) routeType = ' (Valid Page)';
        
        log(`  ✅ ${route}${routeType}`, 'green');
      } else {
        log(`  ❌ ${route} - ${result.error || 'Failed'}`, 'red');
      }
    }
  }
  
  // Recommendations
  log('\n💡 Recommendations:', 'blue');
  log('1. Use any working port from above for testing', 'yellow');
  log('2. Routes should redirect properly (/ → /warungmeng)', 'yellow');
  log('3. Both /yuzha and /warungmeng should load successfully', 'yellow');
  
  // Launcher instructions
  log('\n🚀 Launcher Usage:', 'blue');
  log('Windows: Run RUN.bat and check console for actual port', 'yellow');
  log('Cross-platform: npm run launcher', 'yellow');
  log('Manual testing: Open http://localhost:[PORT]/yuzha in browser', 'yellow');
  
  log('\n✅ Route testing complete!', 'green');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}