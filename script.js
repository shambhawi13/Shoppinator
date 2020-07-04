/* Search Page Logic here */
//Sample image URL:
// https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRyTqyx98Kh8VjAwJ7Ud-k1XuKiibR_SuprGbsBln-tl-uhVaNkw7FIzEPWCA&usqp=CAc


// Please replace the API key below:
var rapidAPIKey = '1bf62c9debmsh3edd1466134defbp184527jsn0116cb66a76e';
var resultObject;
//default value on page load
var storeType = 'online';
var accordSelected = 'image';
var b64;

// $('.ui.accordion')
//     .accordion()
//     ;

$('.toggle-store-online input[type="checkbox"]').click(function () {
    if ($(this).is(":checked")) {
        storeType = 'store';
        console.log("Checkbox is checked." + storeType);
        // $(".display-map").attr("style","display: inline-block !important");
        // $(".display-div").attr("style","display: none !important");
    }
    else if ($(this).is(":not(:checked)")) {
        storeType = 'online';
        console.log("Checkbox is unchecked." + storeType);
        // $(".display-div").attr("style","display: inline-block !important");
        // $(".display-map").attr("style","display: none !important");
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

function amazonSearch(item) {
    // var items = item.join(",");
    axios.get("https://amazon-product-reviews-keywords.p.rapidapi.com/product/search?country=US&keyword=" + item, {
      "headers": {
        "x-rapidapi-host": "amazon-product-reviews-keywords.p.rapidapi.com",
        "x-rapidapi-key": rapidAPIKey
      }
    })
    .then(response => {
      console.log(response);
      var products = response.data.products;
      for (let i=0; i<products.length; i++){
        var thumbnail = products[i].thumbnail;
        var productName = products[i].title;
        var productLink = products[i].url;
        var productPrice = products[i].price;
        var productRating = products[i].rating

        var column = $('<div class="column"></div>');
        $(".stackable-grid").append(column);
        var displayCards = $('<div class="ui segment display-cards prod">');
        $(column).append(displayCards);
        var prodImageDiv = $('<div class="prod1-image">');
        $(displayCards).append(prodImageDiv);
        var prodImage = $('<img class="ui centered image product-image" />');
        $(prodImage).attr('src', thumbnail);
        $(prodImageDiv).append(prodImage);
        var breakEl = $('<br /><br />');
        $(displayCards).append(breakEl);
        var prodText = $('<div class="ui center aligned prod-text">');
        $(displayCards).append(prodText);
        var prodLink = $('<a class="item product-link">List Item</a>');
        $(prodLink).text(productName.slice(0, 19) + "...");
        $(prodLink).attr('href', productLink);
        $(prodText).append(prodLink);
        var prodPrice = $('<p class="product-price"></p>');
        $(prodPrice).text("Price: $" + productPrice);
        $(prodText).append(prodPrice);
        var prodRating = $('<p class="product-rating"></p>');
        $(prodRating).text("Rating: " + productRating);
        $(prodText).append(prodRating);

      }
      

      document.getElementById("product1-image").src = thumbnail1;
      document.getElementById("product1-link").innerHTML = (productName1.slice(0, 19) + "...");
      document.getElementById("product1-link").href = productLink1;
      document.querySelector(".product1-price").textContent = ("Price: $" + productPrice1);
      document.querySelector(".product1-rating").textContent = ("Rating: " + productRating1);

      var thumbnail2 = products[1].thumbnail;
      var productName2 = products[1].title;
      var productLink2 = products[1].url;
      var productPrice2 = products[1].price;
      var productRating2 = products[1].rating

      document.getElementById("product2-image").src = thumbnail2;
      document.getElementById("product2-link").innerHTML = (productName2.slice(0, 19) + "...");
      document.getElementById("product2-link").href = productLink2;
      document.querySelector(".product2-price").textContent = ("Price: $" + productPrice2);
      document.querySelector(".product2-rating").textContent = ("Rating: " + productRating2);

      var thumbnail3 = products[2].thumbnail;
      var productName3 = products[2].title;
      var productLink3 = products[2].url;
      var productPrice3 = products[2].price;
      var productRating3 = products[2].rating

      document.getElementById("product3-image").src = thumbnail3;
      document.getElementById("product3-link").innerHTML = (productName3.slice(0, 19) + "...");
      document.getElementById("product3-link").href = productLink3;
      document.querySelector(".product3-price").textContent = ("Price: $" + productPrice3);
      document.querySelector(".product3-rating").textContent = ("Rating: " + productRating3);

      var thumbnail4 = products[3].thumbnail;
      var productName4 = products[3].title;
      var productLink4 = products[3].url;
      var productPrice4 = products[3].price;
      var productRating4 = products[3].rating

      document.getElementById("product4-image").src = thumbnail4;
      document.getElementById("product4-link").innerHTML = (productName4.slice(0, 19) + "...");
      document.getElementById("product4-link").href = productLink4;
      document.querySelector(".product4-price").textContent = ("Price: $" + productPrice4);
      document.querySelector(".product4-rating").textContent = ("Rating: " + productRating4);
      // for (var i=0; i<4; i++){
      //   var products = response.data.products;
      //   var thumbnail1 = products[0].thumbnail;
      //   var productName1 = products[0].title;
      //   var productLink1 = products[0].url;
      //   var productPrice = products[0].price;
      //   var productRating = products[0].rating

      //   document.getElementById(`product${i + 1}-image`).src = thumbnail1;
      //   document.getElementById(`product${i + 1}-link`).innerHTML = productName1.split(",")[0];
      //   document.getElementById(`product${i + 1}-link`).href = productLink1;
      //   document.querySelector(`.product${i + 1}-price`).textContent = ("Price: $" + productPrice);
      //   document.querySelector(`.product${i + 1}-rating`).textContent = ("Rating: " + productRating);
      // }

    })
    .catch(error => {
      console.log(error);
    })
}


var randomObjects = ["chair", "iphone", "laptop"];

for (var i=0; i<randomObjects.length; i++) {
  $("#item-buttons").append(`
    <div class="ui segment center aligned small obj-button">
      <button class="ui fluid primary button item object-btn"><p class="prod-text1">${randomObjects[i]}</p></button>
    </div>
  `);

}

$('.item').click(function() {
  var object = $(this).text();
  $('.stackable-grid').empty();
  console.log(object);
  amazonSearch(object);
});
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
//https://developers.google.com/maps/documentation/javascript/markers
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
