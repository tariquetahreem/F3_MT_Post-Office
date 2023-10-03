// Constants
let ipAddress;
const fetchBtn = document.getElementById('fetchBtn');
const landingPage = document.getElementById('landingPage');
const displayLocationPage = document.getElementById('displayLocationPage');

fetchBtn.disabled = true;
addDataOnLandingPage();

// function to add Data On Landing Page
async function addDataOnLandingPage() {
    try {
        ipAddress = await handleGetUserIPAddress();
        document.getElementById('ipAddress').innerHTML = ipAddress;
        fetchBtn.disabled = false;
        fetchBtn.classList.remove('disabled');
    } catch (error) {
        alert('Something Went Wrong !');
        return window.location.reload();
    }
}

// function to get User IP Address
async function handleGetUserIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org/?format=json')
        const result = await response.json();
        return result.ip;
    } catch (error) {
        console.log(error.code, error.message);
    }
}


// function on fetch button click event  
fetchBtn.addEventListener('click', async () => {
    try {
        landingPage.classList.toggle('inactive');
        displayLocationPage.classList.toggle('inactive');
        const locationData = await handleGetLocationData(ipAddress);
        addDataOnDisplayLocationPage(locationData);
    } catch (error) {
        console.log(error.code, error.message);
    }
})


// function to get Location Data from IP Address
async function handleGetLocationData(IP) {
    try {
        const response = await fetch(`https://ipapi.co/${IP}/json/`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error.code, error.message);
    }
}



// function to add Data On displayLocation Page
async function addDataOnDisplayLocationPage(locationData) {
    try {
        document.getElementById('ipAddressBar').innerHTML = ipAddress;
        document.getElementById('lats').innerHTML = locationData.latitude;
        document.getElementById('long').innerHTML = locationData.longitude;
        document.getElementById('city').innerHTML = locationData.city;
        document.getElementById('region').innerHTML = locationData.region;
        document.getElementById('organisation').innerHTML = locationData.org;
        document.getElementById('hostname').innerHTML = locationData.ip;
        document.getElementById('timeZone').innerHTML = locationData.timezone;

        let datetime = new Date().toLocaleString("en-US", { timeZone: `${locationData.timezone}` });

        document.getElementById('dateTime').innerHTML = datetime;
        document.getElementById('pincode').innerHTML = locationData.postal;
        let mapData = `<iframe src="https://maps.google.com/maps?q=${locationData.latitude},${locationData.longitude}&output=embed" width="100%" height="100%" frameborder="0" style="border:0"></iframe>`;
        document.getElementById('mapDiv').innerHTML = mapData;

        addDataOnCard(locationData.postal);
    } catch (error) {
        console.log('Location render error : ', error.code, ' ', error.message);
    }
}

// function to add data on card
async function addDataOnCard(pincode) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const result = await response.json();
        document.getElementById('message').innerHTML = result[0].Message;

        result[0].PostOffice.forEach(card => {

            let data = `<div class="card" id="card">
                    <p>Name : &nbsp; <span id="name">${card.Name}</span></p>
                    <p>Branch Type : &nbsp; <span id="branchType">${card.BranchType}</span></p>
                    <p>Delivery Status : &nbsp; <span id="deliveryStatus">${card.DeliveryStatus}</span></p>
                    <p>District : &nbsp; <span id="district">${card.District}</span></p>
                    <p>Division : &nbsp; <span id="division">${card.Division}</span></p>
                </div>`;

            document.getElementById('cardsGrid').innerHTML += data;
        });
    } catch (error) {
        console.log('Card render error : ', error.code, ' ', error.message);
    }
}


// -------------------------- search function --------------------------

const searchFunction = () => {
    try {
        let filter = document.getElementById('searchInput').value.toUpperCase();
        let cards = document.getElementsByClassName('card');
        let cardArray = Array.from(cards);

        cardArray.forEach(card => {
            let postName = card.querySelector('#name');
            let branchOffice = card.querySelector('#branchType');

            if (postName || branchOffice) {
                let post = postName.textContent.toUpperCase();
                let branch = branchOffice.textContent.toUpperCase();

                if (post.includes(filter) || branch.includes(filter)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }
        });
    } catch (error) {
        console.log('Searching error : ', error.code, ' ', error.message);
    }
}
