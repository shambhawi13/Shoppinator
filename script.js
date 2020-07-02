/* Search Page Logic here */
var rapidAPIKey = 'c6064b5170msh977e24b1ae6c804p17fd8djsnf539fedd1d13';
//default value on page load
var storeType = 'online';
var accordSelected = 'image';
var b64;

$('.ui.accordion')
    .accordion()
    ;

$('.toggle-store-online input[type="checkbox"]').click(function () {
    if ($(this).is(":checked")) {
        storeType = 'store';
        console.log("Checkbox is checked." + storeType);
    }
    else if ($(this).is(":not(:checked)")) {
        storeType = 'online';
        console.log("Checkbox is unchecked." + storeType);
    }
});

$('#imageAccord').on('click', () => {
    accordSelected = 'image';
    console.log("Image accord selected: " + accordSelected);
});

$('#textAccord').on('click', () => {
    accordSelected = 'text';
    console.log("Text accord selected: " + accordSelected);
});

function uploadImage() {
    document.getElementById('fileInput').click();
}

//converts image to base 64
function readFile() {
    if (this.files && this.files[0]) {
        $('#uploadedFileName').removeClass('hide');
        $('#uploadedFileName').text(this.files[0].name);
        var FR = new FileReader();
        $(FR).on("load", function (e) {
            //console.log('b64 result: ' + e.target.result);
            b64 = e.target.result;

        });
        FR.readAsDataURL(this.files[0]);
    }
}

$("#fileInput").on("change", readFile);

$('.submit-button').on('click', (event) => {
    event.preventDefault();
    var resultObject;

    if (accordSelected === 'image') {

        if (b64) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://google-ai-vision.p.rapidapi.com/cloudVision/imageObjectDetection",
                "method": "POST",
                "headers": {
                    "x-rapidapi-host": "google-ai-vision.p.rapidapi.com",
                    "x-rapidapi-key": rapidAPIKey,
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "processData": false,
                "data": "{ \"source\":\"" + b64 + "\", \"sourceType\": \"base64\"}"
            }
            // $.ajax(settings).done(function (response) {
            //     console.log(response);
            //     localStorage.setItem('scanned-image', JSON.stringify(response.objects));
            //     resultObject = _.map(response.objects, 'name');
            // });
        }
        else {
            var imageUrl = $('.form-image-url input').val().trim();
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://google-ai-vision.p.rapidapi.com/cloudVision/imageObjectDetection",
                "method": "POST",
                "headers": {
                    "x-rapidapi-host": "google-ai-vision.p.rapidapi.com",
                    "x-rapidapi-key": rapidAPIKey,
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "processData": false,
                "data": "{ \"source\":\"" + imageUrl + "\", \"sourceType\": \"url\"}"
            }

            var storesResponse = JSON.parse(localStorage.getItem('scanned-image'));
            //to be removed later
            if (storesResponse) {
                console.log('Stored in local storage');
                //lodash to map names from response
                console.log(_.map(storesResponse, 'name'));
                resultObject = _.map(storesResponse, 'name');
            }
            else {
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    localStorage.setItem('scanned-image', JSON.stringify(response.objects));
                    resultObject = _.map(response.objects, 'name');
                });
            }

        }

    }
    else if (accordSelected === 'text') {
        resultObject = [];
        let productName = $('#product-name').val().trim();
        resultObject.push(productName);
    }

});


// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://google-ai-vision.p.rapidapi.com/cloudVision/imageObjectDetection",
//     "method": "POST",
//     "headers": {
//         "x-rapidapi-host": "google-ai-vision.p.rapidapi.com",
//         "x-rapidapi-key": rapidAPIKey,
//         "content-type": "application/json",
//         "accept": "application/json"
//     },
//     "processData": false,
//     "data": "{ \"source\": \"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRyTqyx98Kh8VjAwJ7Ud-k1XuKiibR_SuprGbsBln-tl-uhVaNkw7FIzEPWCA&usqp=CAc\", \"sourceType\": \"url\"}"
// }

/* Search Page Logic ends here */

/* Result Page */

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
        " Longitude: " + position.coords.longitude);

    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+ " & zoom=14 & size=400x300 & sensor=false & key=" + "AIzaSyBhIY-oXFJCLXLjRZz4GvKJeOlzMTcHxcA";

    document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
}

//getLocation();

const url = 'https://cors-anywhere.herokuapp.com/https://api.sandbox.ebay.com/identity/v1/oauth2/token';

//const token = Buffer.from(`Giovanni-Shoppina-SBX-4c8e89b76-44e3c891:SBX-c8e89b76f7ec-0537-4b4e-b43f-5099`, 'utf8').toString('base64')

axios.post(url, {
  headers: {
    'Authorization': `Basic R2lvdmFubmktU2hvcHBpbmEtU0JYLTRjOGU4OWI3Ni00NGUzYzg5MTpTQlgtYzhlODliNzZmN2VjLTA1MzctNGI0ZS1iNDNmLTUwOTk`,
    'content-type': 'application/x-www-form-urlencoded'
  }
}) .then(function (response) {
    console.log(response);
  })
