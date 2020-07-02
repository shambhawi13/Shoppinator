/* Search Page Logic here */
var rapidAPIKey = 'c6064b5170msh977e24b1ae6c804p17fd8djsnf539fedd1d13';

$('.ui.accordion')
    .accordion()
    ;

function uploadImage() {
    document.getElementById('fileInput').click();
}

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

$('.submit-button').on('click', (event) => {
    event.preventDefault();
    var imageUrl = $('.form-image-url input').val().trim();
    console.log('Submit clicked', imageUrl);

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

    console.log(settings);
    
    console.log(_.chunk(['a', 'b', 'c', 'd'], 2));
    var storesResponse = JSON.parse(localStorage.getItem('scanned-image'));
    //to be removed later
    if(storesResponse){
        console.log('Stored in local storage');
        //lodash to map names from response
        console.log(_.map(storesResponse, 'name'));
    }
    else{
        $.ajax(settings).done(function (response) {
            console.log(response);
            localStorage.setItem('scanned-image',JSON.stringify(response.objects));
        });
    }
})


/* Search Page Logic ends here */
