let order_id = JSON.parse(document.getElementById('order-id').innerText);

let websocket_url = `ws://${window.location.host}/ws/payment-socket/${order_id}/`

let paymentSocket = new WebSocket(websocket_url)

