@echo off
echo Starting Macchiato Suites Backend...
cd %~dp0
bun install
bun run dev
