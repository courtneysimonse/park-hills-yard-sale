import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// US map options
var options = {
  zoomSnap: .5,
  center: [39.07,	-84.53],
  zoom: 16,
  minZoom: 12,
  zoomControl: false,
  // attributionControl: false
}

// create map
var map = L.map('mapid', options);

// request tiles and add to map

// Stadia
var Stadia_OSMBright = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// // change zoom control position
// L.control.zoom({
//   position: 'topright'
// }).addTo(map);


// GET DATA
await processData();

// PROCESS DATA FUNCTION
async function processData() {

  // https://docs.google.com/spreadsheets/d/1xF5YkQlI-DKL1OD9vIcyJHbw-GLsmHcSIIawUehH5OQ/edit?usp=sharing
  const features = await d3.csv('https://docs.google.com/spreadsheets/d/1xF5YkQlI-DKL1OD9vIcyJHbw-GLsmHcSIIawUehH5OQ/gviz/tq?tqx=out:csv&sheet=addresses', (d, i) => {
    // console.log(d);
    if (d.lat != "") {
      return {
        type: "Feature",
        properties: {
          address: d.address,
          number: i+1
        },
        geometry: {
          type: "Point",
          coordinates: [+d.lon,+d.lat]
        }
      }
    }

  })


  drawMap(features);

}   //end processData()

// DRAW MAP FUNCTION
function drawMap(data) {

  const bounds = L.latLngBounds([39.07,	-84.531]);

  const layer = L.geoJSON(data, {
    pointToLayer: function(geoJsonPoint, latlng) {
      bounds.extend(latlng);

      let iconDiv = document.createElement('span');
      iconDiv.innerText = geoJsonPoint.properties.number;
      let icon = L.divIcon({
        html: geoJsonPoint.properties.number,
        className: 'map-icon'
      });
      return L.marker(latlng, {
        riseOnHover: true,
        icon: icon,
      });
    }
    }).bindTooltip(function (layer) {
      return layer.feature.properties.address;
    }).bindPopup(function (layer) {
        return layer.feature.properties.address;
    }).addTo(map);
  
    bounds.pad(0.1);

    map.fitBounds(bounds);

    layer.on('click', (e) => {
      map.flyTo(e.latlng, 18)
    })

}   //end drawMap()
