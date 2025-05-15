@echo off
echo Starting Macchiato Suites Frontend...
cd %~dp0
bun install
bun run dev
