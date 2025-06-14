@echo off
echo Stopping all services...

:: Define ports for each service
set PORTS=3000 3001 3002 3003 3004 3005 3006 3007

for %%P in (%PORTS%) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%P ^| findstr LISTENING') do (
        echo Killing process on port %%P with PID %%a
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo All services stopped.
pause