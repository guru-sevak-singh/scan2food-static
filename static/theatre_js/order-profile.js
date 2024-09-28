function showTax() {
    let order_area = document.getElementById('order-items');

    let sub_amount = parseFloat(document.getElementById('sub-amount').innerText);

    let all_taxes = order_area.querySelectorAll('.tax-perscantage');

    let grand_sum = 0
    grand_sum += sub_amount;

    let tax_amounts = order_area.querySelectorAll('.tax-amount')
    for (let i = 0; i < all_taxes.length; i++) {

        let tax_perscantage = parseFloat(all_taxes[i].innerText)

        let tax_amount = sub_amount * (tax_perscantage / 100)

        tax_amounts[i].innerText = tax_amount
        grand_sum += tax_amount
    }

    grand_sum = grand_sum.toFixed(2)
    let amount_titles = document.querySelectorAll('.amount-with-tax')

    amount_titles.forEach(element => {
        element.innerText = grand_sum;
    });

    document.getElementById('bill_amount').value = parseFloat(grand_sum);


}

async function getRequest(url) {
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data;
        })
        .catch(function (error) {
            console.error('Error:', error);
            throw new Error('Failed to fetch data');
        });
}


function printKot(order_id) {
    window.open(`/kot/${order_id}`, "", "width=600, height=600")
}

function printBill(order_id) {
    window.open(`/bill/${order_id}`, "", "width=600, height=600")
}

function createOrderTab(order_data) {
    if (order_data.order_detail.food_delivered === false) {
        document.getElementById('delivery-status').innerHTML = `<i class="fa fas fa-clock text-danger mb-0 me-1"></i>Delivery Pending`
    }
    else {
        document.getElementById('delivery-status').innerHTML = `<i class="fa fas fa-check-circle text-success mb-0 me-1"></i> Order Delivery`
    }
    document.getElementById('order-id').innerText = `#${order_data.order_detail.order_id}`;
    document.getElementById('seat-name').innerText = order_data.seat;
    document.getElementById('order-date').innerText = order_data.order_detail.order_date;
    document.getElementById('order-time').innerText = order_data.order_detail.order_time;

    if (order_data.order_detail.payment_pending === true) {
        payment_status = '<i class="fa fas fa-clock text-danger mb-0 me-1"></i> Pending';
        document.getElementById('panding-amount-heading').innerText = 'Pending Amount';
    }
    else {
        payment_status = '<i class="fa fas fa-check-circle text-success mb-0 me-1"></i>  Done'
        document.getElementById('panding-amount-heading').innerText = 'Amount Paid'
    }

    document.getElementById('payment-status').innerHTML = payment_status
    document.getElementById('payment-tab-payment-status').innerHTML = payment_status

}

function createCartTab(order_data) {
    let cart_items = order_data.order_items;
    let all_tax_area_html = document.getElementById('all-tax-area').innerHTML
    document.getElementById('order-items').innerHTML = ""
    for (let i = 0; i < cart_items.length; i++) {
        let item = cart_items[i];
        let item_row = `
                        <div class="row mb-2 order-item">
                            <div class="col-8">
                                <h6 class="d-flex align-items-center">
                                    <span class="ms-2">${item.name}</span>
                                </h6>
                                <p class="text-muted ms-4 ps-2" style="font-size: 0.85rem;">Quantity:
                                    ${item.quantity}</p>
                            </div>
                            <div class="col-4 text-end">
                                <h6 class="price"><span class="me-1-cust">₹</span>${item.price}</h6>
                            </div>
                        </div>
        `
        document.getElementById('order-items').innerHTML += item_row;
    }
    document.getElementById('order-items').innerHTML += `
                        <div class="d-flex justify-content-between mt-3">
                            <p class="text-muted">Sub Total</p>
                            <h6 class="total-amount"><span class="me-1-cust">₹</span><span
                                    id="sub-amount">${order_data.order_amount}</span></h6>
                        </div>
                        <div id="all-tax-area">
                        ${all_tax_area_html}
                        </div>
                        <div class="d-flex justify-content-between">
                            <p class="text-muted">Total</p>
                            <h6 class="total-amount"><span class="me-1-cust">₹</span><span class="amount-with-tax">

                                </span>
                            </h6>
                        </div>
                        
    `
}

function paymentTab(order_data) {

}

async function openOrderProfile(order_id, page) {   
    let order_data_url = "";

    if (page === "order-page") {
        order_data_url = `/theatre/api/order-data/${order_id}`
    }
    else {
        order_data_url = `/theatre/api/seat-last-order/${order_id}`
    }
    let order_data = await getRequest(order_data_url)

    // creating order tab
    createOrderTab(order_data);
    // creating Cart Tab
    createCartTab(order_data);

    // create Payment Tab

    // show tax
    showTax()

    // adjustment.addEventListener('change', (e) => {

    //     let bill_amount = parseFloat(document.getElementById('bill_amount').value);
    //     new_amount = bill_amount;
    //     new_amount = new_amount.toFixed(2)
    //     new_amount = parseFloat(new_amount)
    //     console.log(new_amount)
    //     paid_amount.value = new_amount
    // })


    document.getElementById('food-delivery-pending').addEventListener('click', () => {
        let url = `/update_order_status/${order_id}/false`;
        getRequest(url);
        document.getElementById('delivery-status').innerHTML = '<i class="fa fas fa-clock text-danger mb-0 me-1"></i>Delivery Pending';
    })

    document.getElementById('food-delivery-done').addEventListener('click', () => {
        let url = `/update_order_status/${order_id}/true`;
        getRequest(url);
        document.getElementById('delivery-status').innerHTML = '<i class="fa fas fa-check-circle text-success mb-0 me-1"></i>Delivery Done';
    })

}