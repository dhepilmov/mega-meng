#!/usr/bin/env node

/**
 * Mega Meng Frontend Launcher (Cross-Platform)
 * Provides easy development server management with route picker
 */

import fs from 'fs';
import path from 'path';
import { spawn, exec } from 'child_process';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  DEV_PORT: 3000,
  STATIC_PORT: 5000,
  NETLIFY_PORT: 8888,
  BACKEND_URL: 'https://yuzhayo.pythonanywhere.com/api/',
  CACHE_DIR: '.cache',
  STAMP_FILE: '.cache/deps.sha256'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkRequirements() {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    log('❌ ERROR: No package.json found. Run this from the frontend directory.', 'red');
    process.exit(1);
  }

  // Check Node.js and npm
  try {
    import('child_process').then(cp => cp.execSync('node --version', { stdio: 'pipe' }));
    import('child_process').then(cp => cp.execSync('npm --version', { stdio: 'pipe' }));
  } catch (error) {
    log('❌ ERROR: Node.js or npm not found in PATH', 'red');
    process.exit(1);
  }
}

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function needsInstall(forceReinstall = false) {
  if (forceReinstall) return true;
  if (!fs.existsSync('node_modules')) return true;

  const lockFile = fs.existsSync('package-lock.json') ? 'package-lock.json' : 'package.json';
  const currentHash = getFileHash(lockFile);
  
  if (!fs.existsSync(CONFIG.STAMP_FILE)) return true;
  
  const storedHash = fs.readFileSync(CONFIG.STAMP_FILE, 'utf8').trim();
  return currentHash !== storedHash;
}

function installDependencies() {
  log('📦 Installing dependencies with npm...', 'yellow');
  
  return new Promise((resolve, reject) => {
    const install = spawn('npm', ['install'], { stdio: 'inherit' });
    
    install.on('close', (code) => {
      if (code === 0) {
        // Save hash for next time
        const lockFile = fs.existsSync('package-lock.json') ? 'package-lock.json' : 'package.json';
        const currentHash = getFileHash(lockFile);
        
        if (!fs.existsSync(CONFIG.CACHE_DIR)) {
          fs.mkdirSync(CONFIG.CACHE_DIR, { recursive: true });
        }
        fs.writeFileSync(CONFIG.STAMP_FILE, currentHash);
        
        log('✅ Dependencies installed successfully!', 'green');
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
  });
}

async function startServer(type, port) {
  let command, args, title;
  
  switch (type) {
    case 'dev':
      command = 'npm';
      args = ['run', 'dev'];
      title = 'Mega Meng Dev Server';
      break;
    case 'netlify':
      command = 'npx';
      args = ['--yes', 'netlify-cli@latest', 'dev', '-p', port.toString()];
      title = 'Mega Meng Netlify Dev';
      break;
    case 'static':
      // Build first if needed
      if (!fs.existsSync('build/index.html')) {
        log('🔨 Building production bundle...', 'yellow');
        const { execSync } = await import('child_process');
        execSync('npm run build', { stdio: 'inherit' });
      }
      command = 'npx';
      args = ['--yes', 'serve', '-s', 'build', '-l', port.toString()];
      title = 'Mega Meng Static Preview';
      break;
  }
  
  log(`🚀 Starting ${title} on http://localhost:${port}`, 'green');
  
  const server = spawn(command, args, { 
    stdio: 'inherit',
    env: { ...process.env, PORT: port.toString() }
  });
  
  // Wait a moment for server to start
  setTimeout(() => {
    showRouteMenu(`http://localhost:${port}`);
  }, type === 'netlify' ? 3000 : 2000);
  
  return server;
}

function showRouteMenu(baseUrl) {
  log('\n' + '='.repeat(40), 'cyan');
  log('🏠 MEGA MENG ROUTES', 'bright');
  log('='.repeat(40), 'cyan');
  log('W - WarungMeng (/warungmeng)', 'yellow');
  log('Y - Yuzha Launcher (/yuzha)', 'yellow');  
  log('R - Root (/) - redirects to WarungMeng', 'yellow');
  log('B - Both WarungMeng + Yuzha', 'yellow');
  log('N - None (server only)', 'yellow');
  log('='.repeat(40), 'cyan');
  
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', (key) => {
    const choice = key.toString().toUpperCase();
    
    switch (choice) {
      case 'W':
        openUrl(`${baseUrl}/warungmeng`);
        break;
      case 'Y':
        openUrl(`${baseUrl}/yuzha`);
        break;
      case 'R':
        openUrl(baseUrl);
        break;
      case 'B':
        openUrl(`${baseUrl}/warungmeng`);
        setTimeout(() => openUrl(`${baseUrl}/yuzha`), 1000);
        break;
      case 'N':
        log('✅ Server running without opening browser', 'green');
        break;
      case '\u0003': // Ctrl+C
        process.exit(0);
        break;
      default:
        return; // Invalid choice, keep listening
    }
    
    log(`\n🌐 Backend API: ${CONFIG.BACKEND_URL}`, 'blue');
    log('Press Ctrl+C to stop the server', 'cyan');
    
    // Stop listening for route choices
    process.stdin.setRawMode(false);
    process.stdin.pause();
  });
}

function openUrl(url) {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = 'start';
  } else if (platform === 'darwin') {
    command = 'open';
  } else {
    command = 'xdg-open';
  }
  
  exec(`${command} "${url}"`, (error) => {
    if (error) {
      log(`🌐 Open manually: ${url}`, 'cyan');
    } else {
      log(`🌐 Opened: ${url}`, 'green');
    }
  });
}

function showMainMenu() {
  log('\n' + '='.repeat(50), 'cyan');
  log('🎯 MEGA MENG FRONTEND LAUNCHER', 'bright');
  log('='.repeat(50), 'cyan');
  log('1 - Dev server (npm run dev)', 'yellow');
  log('2 - Netlify Dev (netlify-cli dev)', 'yellow');
  log('3 - Static Preview (serve ./build)', 'yellow');
  log('Q - Quit', 'yellow');
  log('='.repeat(50), 'cyan');
  
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', (key) => {
    const choice = key.toString().toUpperCase();
    
    process.stdin.setRawMode(false);
    process.stdin.pause();
    
    switch (choice) {
      case '1':
        startServer('dev', CONFIG.DEV_PORT);
        break;
      case '2':
        startServer('netlify', CONFIG.NETLIFY_PORT);
        break;
      case '3':
        startServer('static', CONFIG.STATIC_PORT);
        break;
      case 'Q':
      case '\u0003': // Ctrl+C
        log('👋 Goodbye!', 'green');
        process.exit(0);
        break;
      default:
        log('❌ Invalid choice. Try again.', 'red');
        showMainMenu();
        break;
    }
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const forceReinstall = args.includes('--reinstall');
  
  log('🚀 Mega Meng Frontend Launcher', 'bright');
  log('Cross-platform development server manager\n', 'cyan');
  
  checkRequirements();
  
  if (needsInstall(forceReinstall)) {
    try {
      await installDependencies();
    } catch (error) {
      log(`❌ Installation failed: ${error.message}`, 'red');
      process.exit(1);
    }
  } else {
    log('✅ Dependencies up to date, skipping install', 'green');
  }
  
  showMainMenu();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n👋 Shutting down gracefully...', 'yellow');
  process.exit(0);
});

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}