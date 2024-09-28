const csrftoken = document.querySelector('[name=csrf-token]').content;

// function to hit the post request
async function PostRequest(url, data) {
    console.log(data);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data),
    })
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

// open
function openCart(a) {
    let table_name = a.getAttribute('selected-table-name');
    document.getElementById("cartPopUpLabel").innerText = table_name;

    // minimize the existing modal [ Menu Modal ]
    $("#menuePopUp").modal('hide');

    // Show the Cart PupUp
    $("#cartPopUp").modal("show")

    loadCart(table_name)
}

function backCart() {
    // minimize the cart window
    $("#cartPopUp").modal("hide");

    // getting the name of table
    let table_name = document.getElementById('cartPopUpLabel').innerText;
    // open the old table

    OpenPopUp(table_name);
}

function generateOrder() {
    let table_name = document.getElementById('cartPopUpLabel').innerText;

    let table_cart_data = localStorage.getItem(table_name)
    table_cart_data = JSON.parse(table_cart_data);

    console.log(table_cart_data);
}

function loadCart(table_name) {
    // empty old cart
    let cart_box = document.getElementById('cart-items');
    cart_box.innerHTML = ""

    let table_cart_data = localStorage.getItem(table_name)
    table_cart_data = JSON.parse(table_cart_data);


    // loading the cart starts from here

    for (let i in table_cart_data) {
        let cart_item = table_cart_data[i]
        let item_name = cart_item.name;
        let item_type = cart_item.item_type;
        let item_price = cart_item.item_price;
        let item_description = cart_item.item_description;
        let item_quantity = cart_item.quantity;
        // load a single item
        createItemCart(item_name, item_type, item_price, item_quantity, item_description, i);
    }

    getCartAmount(table_cart_data)
}


function createItemCart(item_name, item_type, item_price, item_quantity, item_description, item_id) {
    let cart_box = document.getElementById('cart-items');
    let old_html = cart_box.innerHTML;
    let new_item_card = `
                    <div class="col-lg-6 col-md-6 col-12">
                        <div class="cart-item">
                            <h1 class='item-id' style="display:none;">${item_id}</h1>
                            <div class="row">
                                <div class="col-lg-8 col-md-6 col-9">
                                    <h6 class="d-flex align-items-center">
                                        <span class="${item_type}-icon"></span>
                                        <span class="ms-2">${item_name}</span>
                                    </h6>
                                </div>
                                <div class="col-lg-4 col-md-6 col-3 text-end">
                                    <h6 class="price"><span class="me-1-cust">₹</span>${item_price}</h6>
                                </div>
                            </div>

                            <p class="text-muted small">${item_description}</p>
                            <div class="row align-items-center g-3">
                                <div class="col-lg-6 col-md-6 col-12">
                                    <div class="quantity">
                                        <button class="btn btn-primary" onclick="DecreseQuantityInCart(this)">-</button>
                                        <input type="text" class="quantity-box" value="${item_quantity}" readonly>
                                        <button class="btn btn-primary" onclick="IncreseQuantityInCart(this)">+</button>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-12 text-md-end text-lg-end text-start">
                                    <a class="dismiss-icon text-primary text-end remove-link" onclick="removeItemInCart(this)">
                                        <i class="fas fa-times me-1"></i>
                                        Remove Item
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
    `
    old_html += new_item_card
    cart_box.innerHTML = old_html;
}

function getCartAmount(cart_data) {

    // cart data get from old data
    let total_amount = 0;
    for (let cart_item in cart_data) {
        item_amount = cart_data[cart_item]['item_price'] * cart_data[cart_item]['quantity'];
        total_amount += item_amount;
    }
    calculateTax(total_amount)
    document.getElementById('total-cart-amount').innerText = total_amount;
    document.getElementById('cart-amount').innerText = total_amount;

    totalPayBalance();
}

function totalPayBalance() {
    let elements = document.querySelectorAll('.amounts');
    let total_amount = 0;
    elements.forEach(element => {
        number = Number(element.innerText);
        total_amount += number;
    });

    total_amount = total_amount.toFixed(2)

    document.getElementById('total-amount').innerText = total_amount;
}

function calculateTax(amount) {
    let all_taxes = document.querySelectorAll('.tax-perscantage');
    let all_tax_amounts = document.querySelectorAll('.tax-amount');

    for (let i = 0; i < all_taxes.length; i++) {
        try {
            let tax_perscantage = parseFloat(all_taxes[i].innerText);
            let tax_amount = amount * (tax_perscantage / 100);
            tax_amount = tax_amount.toFixed(2)
            all_tax_amounts[i].innerText = tax_amount;
        }
        catch (error) {
            console.log(error)
        }
    }
}

async function createOrder() {
    let order_data = {}
    let seat_name = document.getElementById('cartPopUpLabel').innerText;
    let cart_data = localStorage.getItem(seat_name);

    let theatre_id = JSON.parse(document.getElementById('theatre-id').innerText);
    console.log(theatre_id);
    order_data['theatre_id'] = theatre_id;
    order_data['cart_data'] = JSON.parse(cart_data);
    order_data['seat'] = seat_name;

    let url = "/theatre/api/create-order"
    let data;
    data = await PostRequest(url, order_data);

    localStorage.removeItem(seat_name);
    let redirect_url = data['url']
    console.log(redirect_url);
    window.open(redirect_url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=10,width=600,height=600");
    $("#cartPopUp").modal("hide");
}


function IncreseQuantityInCart(button) {
    let table_name = document.getElementById('cartPopUpLabel').innerText;

    // getting the parent div
    let parentDiv = button.parentElement.parentElement.parentElement.parentElement;

    // getting the item id
    let item_id = parentDiv.getElementsByClassName('item-id')[0].innerText;

    // getting the cart data
    let table_cart_data = localStorage.getItem(table_name);
    table_cart_data = JSON.parse(table_cart_data);

    // getting the Exact Item
    let item = table_cart_data[item_id];

    // getting teh quantity
    let quantity = item.quantity;

    // Increse The Quantity
    quantity += 1;

    // update in cart
    table_cart_data[item_id].quantity = quantity;

    // Show The New Quantity
    parentDiv.getElementsByClassName('quantity-box')[0].value = quantity;
    getCartAmount(table_cart_data);

    // make data to store
    table_cart_data = JSON.stringify(table_cart_data);

    // update_data in local storage
    localStorage.setItem(table_name, table_cart_data);

}

function DecreseQuantityInCart(button) {
    // getting the table name
    let table_name = document.getElementById('cartPopUpLabel').innerText;

    // getting the parent div
    let parentDiv = button.parentElement.parentElement.parentElement.parentElement;

    // getting the item id
    let item_id = parentDiv.getElementsByClassName('item-id')[0].innerText;

    // getting the cart data
    let cart_data = localStorage.getItem(table_name);
    cart_data = JSON.parse(cart_data);

    // getting the Exact Item
    let item = cart_data[item_id];

    // getting teh quantity
    let quantity = item.quantity;

    // Decrease The Quantity
    quantity -= 1;

    // Check if quantity equal to 0
    if (quantity == 0) {
        let removeLink = parentDiv.getElementsByClassName('remove-link')[0];
        removeLink.click();
    }

    else {

        // update in cart
        cart_data[item_id].quantity = quantity;

        // Show The New Quantity
        parentDiv.getElementsByClassName('quantity-box')[0].value = quantity;
        getCartAmount(cart_data);

        // make data to store
        cart_data = JSON.stringify(cart_data);

        // update_data in local storage
        localStorage.setItem(table_name, cart_data);
    }

}

function removeItemInCart(button) {
    let table_name = document.getElementById('cartPopUpLabel').innerText;

    // getting the parentDiv
    let parentDiv = button.parentElement.parentElement.parentElement.parentElement;

    // getting the pk
    let pk = parentDiv.getElementsByClassName('item-id')[0].innerText;

    // get cart_data from local storage
    let cart_data = localStorage.getItem(table_name);

    // convert from json to dictionary
    cart_data = JSON.parse(cart_data);

    // updateing the data for saving
    delete cart_data[pk];

    // update ui
    getCartAmount(cart_data);

    // save in cart data
    cart_data = JSON.stringify(cart_data);
    localStorage.setItem(table_name, cart_data);

    // remove cart ddiv
    parentDiv.remove();

}
