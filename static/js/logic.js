// Store API endpoint inside queryUrl

  // Define a function for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function circleSize(feature) {
    return feature.properties.mag**2;
  }

  function circleColor(feature) {
    depth = feature.geometry.coordinates[2]

    if (depth < 5){
      color = "red"
    }
    else if (depth < 10)[
      color = "orange"
    ]
    else {color = "blue"

    } 
    return color
  }

 // Define streetmap and darkmap layers
 let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
// Create map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });
// if more than one layer to L is listed the one that shows up 
// is the one defined last above myMap declaration

// Add streetmap tile to map; if only one tile defined then this is a good way of doing this.
// If only one tile layer then the following will be used "L.control.layers(null, overlayMaps, " later in the code
streetmap.addTo(myMap);
// if multiple tiles are being used then the above code is not needed.  The multiple tiles will be added
// when "L.control.layers(baseMaps, overlayMaps, " 


// create layer; will attach data later on
let earthquakes = new L.LayerGroup();

// Create overlay object to hold our overlay layer
let overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
// Pass in baseMaps and overlayMaps
// All layers are added through these lines of code
// if only one tile layer is being used then the basemaps tile group can be 
// replaced with null.  This will prevent a tile button from showing in the
// upper right corner of the screen
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


const queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  // Once we get a response, send the data.features object to the createFeatures function

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    onEachFeature: popUpMsg,
    pointToLayer: function(feature, latlong) {
      return new L.CircleMarker(latlong, {
        radius: circleSize(feature),
        fillOpacity: .25
      });
    },
    style: function(feature) {
      return {color: circleColor(feature)}
    }
  }).addTo(earthquakes);

  earthquakes.addTo(myMap);

  // create legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');

    var depthColors = [0, 5, 10];
    var labels = [];

    div.innerHTML += '<h4>Depth in Kilometers</h4>'

    for (var i = 0; i < depthColors.length; i++){
      div.innerHTML +=
      '<i style="background:' + circleColor({geometry: {coordinates: [0, 0, depthColors[i]]}}) + '"></i> ' +
      depthColors[i] + (depthColors[i + 1] ? '&ndash;' + depthColors[i + 1] + ' km<br>' : '+ km');
    }

  return div;
    
  };
  legend.addTo(myMap)

});



