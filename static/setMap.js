let marks;
let starbucksLocations = [];
let chevronLocations = [];
let cvsLocations = [];

let starbucksIcon = L.icon({
    iconUrl: "static/starbucks.png",
    iconAnchor: [12.5, 25],
    popupAnchor: [0,-41]
  });

let chevronIcon = L.icon({
    iconUrl: "static/chevron.png",
    iconAnchor: [10.5, 41],
    popupAnchor: [0,-41]
  });

let cvsIcon = L.icon({
    iconUrl: "static/target.png",
    iconAnchor: [10.5, 41],
    popupAnchor: [0,-41]
  });


fetch('/getloos')
	.then(function (response) {
	
		return response.json();
	}).then(function (loos) {
		marks = loos;
    for(var i = 0; i < marks.length; i++) {
      if(marks.length < 5) {
        marks[i].push(1);
      }
      else {
        marks[i][4] = 1;
      }
    }
    loadLoos();
	});

  
function loadLoos() {
  
  loadStarbucks();
  loadChevron();
  loadCVS();
  
  for(var i = 0; i < marks.length; i++) {
    let temp = marks[i];
    let x = temp[0];
    let y = temp[1];
    
    

    let urx = map.getBounds()._northEast.lat;
    let ury = map.getBounds()._northEast.lng;
    let brx = map.getBounds()._southWest.lat;
    let bry = map.getBounds()._southWest.lng;
    
     if(temp[4] === 1) {
     if(x <= urx && x >= brx) {
       if(y <= ury && y >= bry) {
        addSpot(x,y,temp[2],temp[3], temp[5],temp[6]);
        marks[i][4] = 0;
        
       }
     }
   }
    

  }

}

function loadStarbucks() {
  let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/starbucks.json?type=poi&proximity=".concat(String(map.getCenter().lng.toFixed(2)), ",", String(map.getCenter().lat.toFixed(2)), "&access_token=pk.eyJ1IjoidGFtY3NtbCIsImEiOiJja3phaGRjc3gyMTJjMnZwNHl0eDU1NGN5In0.HaXGQzds4czES1TZdYpN8Q");

  fetch(url).then(function (response) {
  return response.json();
}).then(function (loo) {
  //console.log(loo.features[0]);
  if(starbucksLocations.length === 0) {
    starbucksLocations.push(loo.features[0].id);
  }
  for(var i = 0; i < loo.features.length; i++) {
    for(var j = 0; j < starbucksLocations.length; j++) {
      if(starbucksLocations[j] === loo.features[i].id) {
        break;
      }
      if(j === starbucksLocations.length-1) {
        starbucksLocations.push(loo.features[i].id);
        addImportedSpot(loo.features[i].center[1], loo.features[i].center[0], "Starbucks");
      }
    }
  }
});
}

function loadChevron() {
  let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/chevron.json?type=poi&proximity=".concat(String(map.getCenter().lng.toFixed(2)), ",", String(map.getCenter().lat.toFixed(2)), "&access_token=pk.eyJ1IjoidGFtY3NtbCIsImEiOiJja3phaGRjc3gyMTJjMnZwNHl0eDU1NGN5In0.HaXGQzds4czES1TZdYpN8Q");

  fetch(url).then(function (response) {
  return response.json();
}).then(function (loo) {
  //console.log(loo.features[0]);
  if(chevronLocations.length === 0) {
    chevronLocations.push(loo.features[0].id);
  }
  for(var i = 0; i < loo.features.length; i++) {
    for(var j = 0; j < chevronLocations.length; j++) {
      if(chevronLocations[j] === loo.features[i].id) {
        break;
      }
      if(j === chevronLocations.length-1) {
        chevronLocations.push(loo.features[i].id);
        addImportedSpot(loo.features[i].center[1], loo.features[i].center[0], "Chevron");
      }
    }
  }
});
}

function loadCVS() {
  let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/target.json?type=poi&proximity=".concat(String(map.getCenter().lng.toFixed(2)), ",", String(map.getCenter().lat.toFixed(2)), "&access_token=pk.eyJ1IjoidGFtY3NtbCIsImEiOiJja3phaGRjc3gyMTJjMnZwNHl0eDU1NGN5In0.HaXGQzds4czES1TZdYpN8Q");

  fetch(url).then(function (response) {
  return response.json();
}).then(function (loo) {
  
  if(cvsLocations.length === 0) {
    cvsLocations.push(loo.features[0].id);
  }
  for(var i = 0; i < loo.features.length; i++) {
    for(var j = 0; j < cvsLocations.length; j++) {
      if(cvsLocations[j] === loo.features[i].id) {
        break;
      }
      if(j === cvsLocations.length-1) {
        cvsLocations.push(loo.features[i].id);
        addImportedSpot(loo.features[i].center[1], loo.features[i].center[0], "Target");
      }
    }
  }
});
}



let myPosition = {lat: 0, long: 0};
let map;
let circle;
map = L.map('map').setView([37.89379531094451, -122.53178431139938], 13);

navigator.geolocation.getCurrentPosition((position) => {
  myPosition.lat = position.coords.latitude;
  myPosition.long = position.coords.longitude;

  
    circle = L.circle([myPosition.lat, myPosition.long], {
    color: 'black',
    fillColor: '#000000',
    fillOpacity: 0.5,
    radius: 25
    }).addTo(map);
    circle.bindPopup("<b>You are here</b>").openPopup();
    
  map.setView([myPosition.lat,myPosition.long], 13);
 
});





function addSpot(x,z,name,rating, id, comments) {
var marker = L.marker([x,z]).addTo(map);
marker.bindPopup("<b>"+name+"</b><br>Rating: "+rating+"<br><a href=\"/reporting?id=" + id + "\"><small><small>report listing</small></small></a> | <button class=\"open-button\" onclick=\"openForm()\"><small><small>Leave rating</small></small></button><div class=\"form-popup\" id=\"myForm\" style=\"display :none;\"><form action=\"/rateloo\" method = \"post\"  class=\"form-container\" style=\"text-align: center; \"> <div class=\'rate-form-group\'><label for=\"rating\"><b>Rating</b></label> <input type=\"number\" name=\"rating\" min = \"1\" max = \"10\" required></div><div class=\'rate-form-group\'><button type=\"submit\" class=\"btn btn-outline-dark\" style=\"padding: 1.5px 4px;\">Enter</button></div><padding> </padding><div class=\'rate-form-group\'> <button type=\"button\" class=\"btn cancel\" onclick=\"closeForm()\">Cancel</button></div> <input type = \"hidden\" name=\"id\" value=\"" + id + "\"></input></form> </div>")
}


function addImportedSpot(x,z,name) {
  let storeIcon;
  if(name === 'Starbucks') {
    storeIcon = starbucksIcon;
  }
  else if(name === 'Chevron') {
    storeIcon = chevronIcon;
  }
  else if(name === 'Target') {
    storeIcon = cvsIcon;
  }

  var marker = L.marker([x,z],{icon: storeIcon}).addTo(map);

  marker.bindPopup("<b>"+name+"</b><br>Imported location");
}


function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoidGFtY3NtbCIsImEiOiJja3phaGRjc3gyMTJjMnZwNHl0eDU1NGN5In0.HaXGQzds4czES1TZdYpN8Q'
}).addTo(map);



 map.on('moveend', function() {
   loadLoos();
 });

 map.on('zoomend', function() {
   //less than 9 or 10
   loadLoos();
 });

