#!/usr/bin/env node
const { spawn } = require('node:child_process');
const path = require('node:path');
require('dotenv').config();

const projectRoot = path.resolve(__dirname, '..');
const env = { ...process.env };

const server = spawn('node', ['--watch', 'server/index.js'], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
  shell: false
});

const client = spawn('npm', ['--prefix', 'client', 'run', 'dev'], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
  shell: true
});

const shutdown = (signal) => {
  if (server.exitCode === null) server.kill(signal);
  if (client.exitCode === null) client.kill(signal);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

server.on('exit', (code, signal) => {
  if (code !== null && code !== 0) process.exit(code);
  if (signal) process.kill(process.pid, signal);
});

client.on('exit', (code, signal) => {
  if (code !== null && code !== 0) process.exit(code);
  if (signal) process.kill(process.pid, signal);
});
