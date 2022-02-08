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

var requestOptions = {
  method: 'GET',
};

function addressLocation(event) {
  event.preventDefault();
  input_obj = document.getElementById('address')
  address = input_obj.value;
  fetch("https://api.geoapify.com/v1/geocode/search?text=" + address + "&apiKey=7197a1567686477e892187781e7a85b4", requestOptions)
  .then(response => response.json())
  .then(function (result) {
    first_result = result.features[0].properties
    full_address = first_result.address_line1 + ", " + first_result.address_line2;
    input_obj.value = full_address;
    lat = first_result.lat;
    long = first_result.lon;
    update_coords(lat, long);
  })
  .catch(error => console.log('error', error));
}

