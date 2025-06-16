# Checkout order - Microservices based

## Setup Instructions
1. **Install Dependencies**:
   - Run `npm install` in the root directory to install required dependencies.
2. **Start Services**:
   - Use the `start-services.bat` script to start all microservices.
   - **Ensure Kafka is installed and running**
3. **Environment Variables**:
   - Set up necessary environment variables in a `.env` file or directly in your system.
   - Example variables:
     - `KAFKA_BROKERS`: URL for the Kafka broker - default value: localhost:9092
     - `KAFKA_CLIENT_ID`: Identificator for Kafka broker - default value: common-client

---

## Assumptions

- Each microservice is independently deployable and scalable.
- Only one `package.json` file is used in the root directory due to the presentation nature of the project. Ideally, each microservice should have its own `package.json` file for better modularity and dependency management.
### Error Handling and Logging Strategy

#### Error Handling

Error handling is designed to ensure graceful degradation of service in case of failure and to provide meaningful feedback for debugging and resolution:

- **Local Error Handling**: Each microservice implements its own error handling within routes and Kafka consumers using `try/catch` blocks and proper HTTP status codes (e.g., `400`, `500`).
- **Event-Based Failures**:
  - `inventory-service` emits `stock.failed` if the requested quantity is not available.
  - `payment-service` emits `payment.failed` if the external payment provider declines the transaction.
- **UI Feedback**: The `checkout-service` returns immediate HTTP responses for validation issues before continuing to async steps.


#### Logging Strategy
Logging is centralized using an **Audit Service**, which listens to all business-critical events and stores them for monitoring, analysis, and compliance.
##### Events Logged:
- `order.created` — when a checkout starts.
- `order.failed` - when order failed due to validation failure.
- `stock.reserved` / `stock.failed` — when stock availability is determined.
- `payment.authorized` / `payment.failed` — when payment is processed.
##### Audit Service Responsibilities:

- **Event Listener**: Consumes all relevant Kafka events (such as `order.created`, `stock.reserved`, etc.).
- **Log Entry Storage**: In the current mock setup, events are logged to the console. In a production system, these logs would be stored in a database or centralized logging system (e.g., ELK stack).
- **Traceability**: Each event contains a consistent `orderId` to facilitate tracing the full lifecycle of an order.
- **Extensibility**: Easy to extend the service to forward logs to external systems like Sentry.
---

## Explanation of Chosen Components
- **Kafka**:
  - Kafka is chosen for its ability to handle high-throughput event streaming and ensure reliable communication between microservices.
- **Express.js**:
  - Used for building RESTful APIs due to its simplicity and flexibility.
- **Yup Schema Validation**:
  - Ensures that incoming requests conform to the expected structure and data types.
- **Microservices Architecture**:
  - Enables modular development, independent scaling, and fault isolation for each service.

---

## Used Tools

- **VSCode**: Used as the primary code editor for development.
- **draw.io**: Utilized for creating architecture diagram
- **ChatGPT**: Leveraged for brainstorming ideas and problem-solving.
- **GitHub Copilot**: Assisted in document generation and code suggestions.

## Additional Documentation

- **Architecture Documentation**: The architecture details can be found in `docs/architecture/architecture.md`.
- **Test Instructions**: Detailed test instructions are available in `docs/test-instructions.md`.
