const Alphabets = ['A', "B", 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

let lastAlphabetSelect = document.getElementById('last-alphabet')
for (let i = 0; i < Alphabets.length; i++) {
    let option = document.createElement('option');
    option.value = Alphabets[i]
    option.innerText = Alphabets[i]
    lastAlphabetSelect.appendChild(option);
}

let addRowButton = document.getElementById('add-rows')
addRowButton.addEventListener('click', () => {
    // Empty the Entire Section
    document.getElementById('all-hall-list').innerHTML = "";


    // function to create new rows and seats
    function createRow(alphabet, seatCounts) {
        let allHallList = document.getElementById('all-hall-list');

        let div = document.createElement('div');
        div.setAttribute('class', 'row custom-theatre-row');
        let smallDiv = document.createElement('div');
        smallDiv.setAttribute('class', 'label row-label')

        smallDiv.innerText = alphabet;

        div.appendChild(smallDiv);
        allHallList.appendChild(div);

        // creating the seats 
        for (let i = 0; i < seatCounts; i++) {
            let newDiv = document.createElement('div');
            newDiv.setAttribute('class', 'seat');
            newDiv.innerText = `${alphabet}${i + 1}`
            div.appendChild(newDiv);
        }

    }
    let last_value = document.getElementById('last-alphabet').value;
    let seatCounts = document.getElementById('seat-counts').value;

    for (let i = 0; i < Alphabets.length; i++) {
        let alphabet = Alphabets[i];

        createRow(alphabet, seatCounts);

        if (alphabet === last_value) {
            break;
        }

        else {
            continue;
        }
    }
})


function saveSeats() {
    let return_data = {}
    let allRow = document.getElementsByClassName('custom-theatre-row');
    for (let i = 0; i < allRow.length; i++) {
        let row = allRow[i];
        let label = row.getElementsByClassName('label')[0].innerText;
        let append_data = [];
        let allSeats = row.getElementsByClassName('seat');
        for (let n = 0; n < allSeats.length; n++) {
            let seat = allSeats[n];
            append_data.push(seat.innerText);
        }
        return_data[label] = append_data;
    }
    return JSON.stringify(return_data);
}


document.getElementById('update-button').addEventListener('click', () => {
    let send_data = saveSeats()
    document.getElementById('send-data').value = send_data;
    document.getElementById('main-submit').click();
})