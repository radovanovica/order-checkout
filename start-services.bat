@echo off
echo Starting all microservices...

start "audit-service" cmd /k "npm run start:audit-service"
start "checkout-service" cmd /k "npm run start:checkout-service"
start "inventory-service" cmd /k "npm run start:inventory-service"
start "notification-service" cmd /k "npm run start:notification-service"
start "payment-service" cmd /k "npm run start:payment-service"
start "stock-cache-service" cmd /k "npm run start:stock-cache-service"
start "validation-service" cmd /k "npm run start:validation-service"
start "mock-payment-gateway" cmd /k "npm run start:mock-payment-gateway"

echo All services are starting...