# Test Instructions

## Prerequisites

1. Ensure all services are running.
2. Kafka must be installed and running.

### Steps

1. Import the Postman collection file (if available) or manually create requests.
2. Set the base URL for requests to `http://localhost:<service-port>`. Default port is 3000
3. Test the following endpoints:
   - **Checkout Service**:
     - `POST /checkout` - Submit a checkout request.


4. Add JSON Body

When testing endpoints, ensure you provide the correct JSON body in the request. Below are examples of valid and invalid JSON bodies for testing:

#### Valid JSON Body

- **Checkout Service**:
  ```json
  {
    "cart": {
      "items": [
        { "productId": "123", "quantity": 2, "price": 10.0 }
      ],
      "totalAmount": 20.0,
      "promoCodes": ["PROMO10"]
    },
    "customer": {
      "id": 10,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

#### Invalid JSON Body Examples

1. **Invalid quantity amount**:
   ```json
   {
     "cart": {
       "items": [
         { "productId": "123", "quantity": 120, "price": 10.0 }
       ],
       "totalAmount": 1200.0,
       "promoCodes": ["PROMO10"]
     },
     "customer": {
       "id": 10,
       "name": "John Doe",
       "email": "john@example.com"
     }
   }
   ```
   - **Reason for Failure**: Insufficient number of items in stock.

2. **Missing Required Fields**:
   ```json
   {
     "cart": {
       "items": [
         { "productId": "123", "quantity": 120, "price": 10.0 }
       ],
       "totalAmount": 1200.0,
       "promoCodes": ["PROMO10"]
     },
     "customer": {
       "id": 10,
       "name": "John Doe"
     }
   }
   ```
   - **Reason for Failure**: customer.email is a required field.


