var lattitude;
var longitude;

$('.ui.accordion')
  .accordion()
  ;

//get users location 
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    initMap();
  } 
  else {
    console.log("User location unavailible");
  }
}

//set the lat and long of the users location
function showPosition(position) {
  lattitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log("lattitude " + lattitude);
  console.log("longitude " + longitude);
}


// Initialize and add the map
function initMap() {
  //await getLocation();
  // The location User
  var userLocation = { lat: lattitude, lng: longitude };
  var sanFran = {lat: 37.75, lng: -122.44};

  // The map, location
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 12, center: sanFran });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({ position: sanFran, map: map });

}


//NOT IN USE
//gets store information based on text input or lat and lon
//https://developers.google.com/places/web-service/search
function storePlaces() {
  url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=The%20Peaks%20Hongkong&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&locationbias&key=AIzaSyASRZUnw8T0CsDlOI92HxIuyYglJRmPauQ"
}