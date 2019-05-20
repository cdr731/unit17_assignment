// Store our API endpoint for USGS earthquake data for all earthquakes in the past 7 days
var usgsUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET request for JSON data
d3.json(usgsUrl, function(data) {
  console.log(data.features);
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Function for feature pop-up
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><h4>" + new Date(feature.properties.time) + "</h4>" +
      "<h4>Magnitude: " + feature.properties.mag + "</h4>" +
      "<h4>Type: " + feature.properties.type + "</h4>");
  }

  // Create GeoJSON layer containing the features array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send earthquake layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  
  // Basemap layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });

  // Object to hold the base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": lightmap,
    "Outdoors": outdoorsmap
  };

  // Object to hold overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create map object
  var myMap = L.map("map", {
    center: [39.83333, -98.58333],
    zoom: 5,
    layers: [satellitemap, earthquakes]
  });

  // Layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}