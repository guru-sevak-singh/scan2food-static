let socket_url = `wss://${window.location.host}/ws/all-seat-datasocket/`

let allSeatSocket = new WebSocket(socket_url)

allSeatSocket.onmessage = (e) => {
    let theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)

    let eventData = JSON.parse(e.data)
    let updated_data = JSON.parse(eventData.updated_table_data);
    

    let order_theatre_id = updated_data.theatre_id
    if (order_theatre_id == theatre_id) {

        let seat_id = `seat-${updated_data.seat_id}`;
        let seat = document.getElementById(seat_id)

        let payment_panding = updated_data.payment_panding;

        if (payment_panding === false) {
            seat.setAttribute('class', 'seat paymentreceived')
        }

        let order_status = updated_data.is_vacent
        if (order_status == true) {
            seat.setAttribute('class', 'seat')
        }

        showOrderData()
    }

}

allSeatSocket.onclose = (e) => {

    try {
        allSeatSocket = new WebSocket(socket_url);

        allSeatSocket.onmessage = (e) => {
            let theatre_id = JSON.parse(document.getElementById('theatre-id').innerText)

            let eventData = JSON.parse(e.data)
            let updated_data = JSON.parse(eventData.updated_table_data);

            let order_theatre_id = updated_data.theatre_id
            if (order_theatre_id == theatre_id) {

                let seat_id = `seat-${updated_data.seat_id}`;
                let seat = document.getElementById(seat_id)

                let seat_status = updated_data.is_vacent

                if (seat_status === true) {
                    seat.setAttribute('class', 'seat')
                }
                else {

                    let payment_panding = updated_data.payment_panding;
                    if (payment_panding === true) {
                        seat.setAttribute('class', 'seat orderreceived')
                    }
                    else {
                        seat.setAttribute('class', 'seat paymentreceived')
                    }
                }
                showOrderData()

            }

        }

    }
    catch (error) {
        console.log(error)
    }

}
