function getLocation() {
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition((position) => {
		
      lat = position.coords.latitude;
      long = position.coords.longitude;
	  update_coords(lat, long);
});
}

// Updated the coords in the form
function update_coords(lat, long) {
	document.getElementById('latitude').value = lat;
	document.getElementById('longitude').value = long;
}

fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/starbucks.json?type=poi&proximity=-122.54,37.9&access_token=pk.eyJ1IjoidGFtY3NtbCIsImEiOiJja3phaGRjc3gyMTJjMnZwNHl0eDU1NGN5In0.HaXGQzds4czES1TZdYpN8Q")
.then(function (response) {
  console.log("hi");
  return response.json();
}).then(function (loo) {
  console.log(loo);
});

//https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
//https://docs.mapbox.com/api/search/geocoding/#point-of-interest-category-coverage
