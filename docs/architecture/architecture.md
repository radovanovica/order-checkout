# Checkout Microservice Architecture

## System Overview
This architecture defines a Checkout Microservice responsible for:
- Creating an order
- Validating a cart (pricing, availability, discounts)
- Handling payment authorization
- Emitting domain events (`order.created`, `stock.reserved`, `stock.failed`, `payment.authorized`, `payment.failed`)

## Architecture Pattern
We use a **Hybrid Architecture** combining **REST** for internal synchronous validation and **Event-Driven Choreography** for core microservice communication.

## System Diagram
Please find system diagram inside docs/architecture dir

## Component Overview

### 1. **Checkout Service**
- Receives cart from UI
- Calls Validation Service via REST
- Emits `order.created` on Kafka if validation is successful

### 2. **Validation Service**
- Validates pricing, discounts, and availability
- Uses internal product and inventory data (via cache or internal call)

### 3. **Inventory Cache Service**
- Provides fast, read-only access to current stock levels
- Listens to `stock.updated`, `stock.reserved`, and `stock.released` from Inventory Service
- Maintains data in Redis or in-memory cache
- Serves Validation Service via REST for quick stock validation
- Optionally supports full data sync fallback from Inventory Service

### 4. **Inventory Service**
- Listens for `order.created`
- Listens for `payment.authorized` or `payment.failed`
- Reserves stock (mock logic)
- Emits `stock.reserved` or `stock.failed` or `stock.released`

### 5. **Payment Service**
- Listens for `stock.reserved`
- Mocks an external API call via `axios`
- Emits `payment.authorized` or `payment.failed`

### 6. **Notification & Audit Services**
- Listen to all relevant events for alerts, logs, and analytics

## Data Modeling (Brief Schema Examples)

**Order**
```json
{
  "id": "uuid",
  "cart": {
    "items": [{ "productId": "123", "quantity": 2, "price": 10.0 }],
    "totalAmount": 20.0,
    "promoCodes":["PROMO10"]
  },
  "customer": {"id": "23", "name": "John Doe", "email": "john@example.com" }
}
```

**Events**
```json
// order.created
{ "id": "uuid", "cart": { ... }, "customer": { ... } }

// order.failed
{ "orderId": "uuid", "reason": "Validation failed due to insufficient stock" }

// stock.reserved
{ "orderId": "uuid" }

// stock.failed
{ "orderId": "uuid", "reason": "Insufficient stock" }

// stock.released
{ "orderId": "uuid", "reason": "Stock released due to payment failure" }

// payment.authorized
{ "orderId": "uuid" }

// payment.failed
{ "orderId": "uuid", "reason": "Card declined" }
```

## Technology Stack
- **Node.js**: All services
- **Kafka (KafkaJS)**: Event communication
- **Express**: API layer
- **Axios**: Mock external API calls
- **Docker + GitHub Actions**: CI/CD pipeline
- **Redis (optional)**: Cache layer for product/stock data
- **Kubernetes (or AWS ECS/EKS)**: Recommended for service orchestration and scaling. Enables horizontal scaling of services (e.g., inventory or payment service under high load).

## Microservice vs Monolith:
Chosen: **Microservices**
We chose a microservice architecture to ensure **scalability**, **modularity**, and **flexibility** across different domains of the checkout process (validation, inventory, payment, etc.). This allows each service to scale **independently**, deploy **independently**, and evolve over time without affecting others. Services like payment and inventory can have very different throughput and **reliability** requirements, which are easier to meet with dedicated microservices.

## Hybrid Communication

**REST**: Used synchronously for real-time validation (e.g., checkout-service calls validation-service via REST to validate cart before proceeding).

**Kafka (Event Bus)**: Used for decoupled communication between services like:

- checkout-service emits `order.created`
- inventory-service listens and emits `stock.reserved` or `stock.failed`
- payment-service listens for `stock.reserved`, contacts a mock gateway, and emits `payment.authorized` or `payment.failed`
- notification-service and audit-service listen to all key events and log or notify accordingly

This hybrid model balances responsiveness with scalability and resilience.

## Reliability & Idempotency

To ensure reliability and idempotency in order and payment processing:

**Idempotency Keys**

The `order.id` is used consistently across services to ensure each operation is processed only once.

**Event Deduplication**

Consumers can be extended to check for already-processed events using Redis, a DB, or in-memory caches.

**Retry Mechanisms**

Kafka automatically retries failed messages depending on the consumer configuration.

**Exactly-once Processing (Future Upgrade)**

Can be implemented using Kafka’s transactional support or custom state tracking.

**Health Checks**

Each service exposes a `/health` endpoint for use by orchestrators (e.g., Kubernetes) and monitoring tools.

## Error Handling Strategy
- `ValidationService`: returns detailed validation errors
- `InventoryService`: emits `stock.failed` if insufficient stock
- `PaymentService`: emits `payment.failed` if gateway rejects transaction
- All events are consumed by Notification/Audit services for transparency

## Payment Processing Idempotency

**Idempotency**: Ensure the payment API supports idempotency (so retries don’t double-charge).

**Retryable Errors**: Only retry on network errors, timeout, or specific status codes (e.g., 5xx).

**Exponential Backoff**: Increase wait time between retries to avoid flooding.
**Maximum Retry Limit**: Prevent infinite loops.

## Trade-Off Analysis
### Event-Driven Choreography
- **Pros**: Loose coupling, scalable, resilient
- **Cons**: Harder to trace end-to-end flows

### REST (Validation Layer)
- **Pros**: Simpler logic validation, quick feedback to user
- **Cons**: Tighter coupling between services

### Hybrid Approach
- **Pros**: Best of both worlds (sync validation, async processing)
- **Cons**: More complexity in coordination, monitoring, and logging

## CI/CD Setup

**GitHub Actions**:

- GitHub Actions is configured to automate the build, test, and deployment process for each microservice.
- Each service has its own workflow file that defines the steps for:
  - Installing dependencies using `npm install`.
  - Running unit tests and integration tests using `npm test`.
  - Building Docker images for the service.
  - Pushing the Docker images to a container registry (e.g., Docker Hub or GitHub Container Registry or AWS ECR).
  - Deploying the service to the target environment (e.g., Kubernetes or AWS ECS).

**Readiness and Liveness Probes**:

- Each microservice exposes a `/health` endpoint to provide information about its operational status.
- **Readiness Probe**: Used by orchestrators like Kubernetes to determine if the service is ready to handle traffic.
- **Liveness Probe**: Used to check if the service is running and responsive.
- These probes help ensure high availability and reliability by enabling automatic restarts of unhealthy services.

## Integration Test Strategy

**Set Up a Test Environment**:

- Use `docker-compose.yml` to spin up all services required for integration testing.
- Ensure all services are running and accessible.

**Create a Test File**:

- Create a new test file, e.g., `integration.test.js`, in a central location like the `test/` folder or the root directory.

**Write Integration Test Cases**:

- Use a testing framework like Jest.
- Test the interaction between services, e.g., sending a request to the `checkout-service` and verifying that the `inventory-service` and `payment-service` respond correctly.

**Mock External Dependencies**:

- Mock external APIs or Kafka events if needed.

**Run Integration Tests**:

- Use a script in `package.json` to run integration tests.

