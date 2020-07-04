/* Search Page Logic here */
//Sample image URL:
// https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRyTqyx98Kh8VjAwJ7Ud-k1XuKiibR_SuprGbsBln-tl-uhVaNkw7FIzEPWCA&usqp=CAc


// Please replace the API key below:
var rapidAPIKey = 'c6064b5170msh977e24b1ae6c804p17fd8djsnf539fedd1d13';
var resultObject;
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

  // show loader
  $('.dimmer').addClass('active');

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
      $.ajax(settings).done(function (response) {
        console.log(response);
        localStorage.setItem('scanned-image', JSON.stringify(response.objects));
        resultObject = _.map(response.objects, 'name');
        resultObject = _.uniq(resultObject);
        //remove loader
        $('.dimmer').removeClass('active');
        // navigate to results page
        window.location.href = "./result.html";
      });
    }
    else {
      var imageUrl = $('.form-image-url textarea').val().trim();
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
      if (storesResponse && storesResponse.length > 0) {
        console.log('Stored in local storage');
        //lodash to map names from response
        console.log(_.map(storesResponse, 'name'));
        resultObject = _.map(storesResponse, 'name');
        resultObject = _.uniq(resultObject);
        //remove loader
        $('.dimmer').removeClass('active');
        getLocation();
        // navigate to results page
        window.location.href = "./result.html";
      }
      else {
        $.ajax(settings).done(function (response) {
          console.log(response);
          localStorage.setItem('scanned-image', JSON.stringify(response.objects));
          resultObject = _.map(response.objects, 'name');
          resultObject = _.uniq(resultObject);
          //remove loader
          $('.dimmer').removeClass('active');
        }).then(() => {
          //call function that performs all task in result page
          getLocation();
          // navigate to results page
          window.location.href = "./result.html";
        });
      }

    }

  }
  else if (accordSelected === 'text') {
    resultObject = [];
    let productName = $('#product-name').val().trim();
    resultObject.push(productName);
    resultObject = _.uniq(resultObject);
    //remove loader
    $('.dimmer').removeClass('active');
    // navigate to results page
    window.location.href = "./result.html";
  }

});


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

  //var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlon + " & zoom=14 & size=400x300 & sensor=false & key=" + "AIzaSyBhIY-oXFJCLXLjRZz4GvKJeOlzMTcHxcA";

  //document.getElementById("mapholder").innerHTML = "<img src='" + img_url + "'>";
  console.log("coords: " + latlon);
}


// START MAP LOGIC HERE
//variables to hold users position
var lattitude;
var longitude;
var markers = [];// array to hold places

/*get users location */
var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.75, lng: -122.44 },
    zoom: 12

  });

  //instantiates new tool window
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //set variables for user location
        lattitude = position.coords.latitude;
        //console.log(lattitude);
        longitude = position.coords.longitude;
        //console.log(longitude);
        infoWindow.setPosition(pos);
        infoWindow.setContent("Your Location.");
        infoWindow.open(map);
        map.setCenter(pos);
        storePlaces(); //
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// 
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);

}

//NOT complete
//gets store information based on text input or lat and lon
//https://developers.google.com/places/web-service/search
function storePlaces() {
  url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=The%20Peaks%20Hongkong&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&locationbias&key=AIzaSyASRZUnw8T0CsDlOI92HxIuyYglJRmPauQ"
  url2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lattitude + "," + longitude + "&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyASRZUnw8T0CsDlOI92HxIuyYglJRmPauQ";
  console.log(url);
  console.log(url2);

   // Adds a marker to the map and push to the array.
   function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    markers.push(marker);
  }
}

//END MAP LOGIC