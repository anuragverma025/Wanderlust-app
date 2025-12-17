/* global maptilersdk, mapToken, coordinates*/

maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: 'map', // The ID of the div in show.ejs
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
  center: coordinates, // Starting position [lng, lat]
  zoom: 9 // Starting zoom
});

// Add a marker at the location
const marker = new maptilersdk.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML("<h4>Exact Location will be provided after booking</h4>"))
  .addTo(map);