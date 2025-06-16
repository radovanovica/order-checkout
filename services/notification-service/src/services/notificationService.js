function mockSendEmail(message) {
  console.log(`Sending mock email notification: "${message}"`);
}

function handleNotification(topic, data) {
  switch (topic) {
    case 'order.created':
      mockSendEmail(`Order ${data?.cart?.id || 'X'} created successfully.`);
      break;
    case 'stock.reserved':
      mockSendEmail(`Stock reserved for Order ${data?.order?.cart?.id}.`);
      break;
    case 'stock.failed':
      mockSendEmail(`Stock reservation failed for Order ${data?.order?.cart?.id} with reason: ${data.reason}`);
      break;
    case 'payment.authorized':
      mockSendEmail(`Payment authorized for Order ${data.orderId}.`);
      break;
    case 'payment.failed':
      mockSendEmail(`Payment failed for Order ${data.orderId} with reason: ${data.reason}.`);
      break;
    default:
      console.log('Unknown event type:', topic);
  }
}

module.exports = { handleNotification };