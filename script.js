// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  zoomControl: false
}).setView([-15.801504,-47.992744,], 12);



L.control.zoom({ position: 'bottomright' }).addTo(map);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/eduardaaun/cjucu3xpg12mu1fntgbm3rihq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWR1YXJkYWF1biIsImEiOiJjajI1OWQ4b3kwMDhtMzJsZWdmOHhocWFpIn0.dM0AOmAI9UmpTcD6J8jNKw', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'xb7MSSHI6lsKXCsVxHIEVA',
  username: 'eduardaaun'
});

// Initialze source data - case studies 
var casestudiesSource = new carto.source.SQL('SELECT * FROM case_studies_edited');

// Create style for the data
var casestudiesStyle = new carto.style.CartoCSS(`
  #layer {
  marker-width: 15;
  marker-fill: #b10cff;
  marker-fill-opacity: .6;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #ffffff;
  marker-line-opacity: 0;
}
`);

// Add style to the data
var casestudiesLayer = new carto.layer.Layer(casestudiesSource, casestudiesStyle, {
  featureClickColumns: ['cartodb_id', 'atividade','activity','organizado', 'name', 'descriptio','quando', 'local','foto','foto_2', 'foto_3','contact',],
  featureOverColumns: ['cartodb_id', 'atividade','activity','organizado', 'name', 'descriptio','quando', 'local','foto','foto_2', 'foto_3','contact',]
});

casestudiesLayer.on('featureClick', function (event) {
   var content = '<h7>' + event.data['atividade'] + '</h7>'
  content += '<h4>' + event.data['activity'] + ' <h4>';
  popup.setContent(content);
  console.log('featureClick');
});

var popup = L.popup();
casestudiesLayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h7>' + event.data['atividade'] + '</h7>'
  popup.setContent(content);
  
  var sidebar = document.querySelector('.sidebar-content');
  sidebar.style.display = 'block';
  
  
  var panelClose = document.querySelector('.panel-close');
  panelClose.style.display = 'block';
  
  var content = '<h3>' + event.data['name'] + '</h3>'
  content += '<h4>' + event.data['atividade'] + ' <h4>';
  
  if (event.data['foto'] == null) {
    content += '<d>Desculpa! Imagem não disponível</div>';
  }
  else {
    content += '<img src="' + event.data['foto'] + '"/>';
  }
    
  if (event.data['descriptio'] == null) {
    content += '<div></div>';
  }
  else {
    content += '<h5>' + event.data['descriptio'] + ' <h5>';
  }
  
  content += '<h5>Organizado por: ' + event.data['organizado'] + ' <h5>';
  content += '<div>Onde: ' + event.data['local'] + ' </div>';
  
  if (event.data ['quando'] == null) {
    content += '<div></div>';
  }
  else {
  content += '<div>Quando: ' + event.data['quando'] + ' </div>';
  }
  content += '<a class="maisinfo" href="' + event.data['contact'] + '" target="_blank"> Mais informação </a>';
  
  // Then put the HTML inside the sidebar. Once you click on a feature, the HTML
  // for the sidebar will change.
  sidebar.innerHTML = content;
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);

  // Zoom to the latitude and longitude of the clicked feature
  map.setView([event.latLng.lat, event.latLng.lng], 15);
});

/*
 * Begin layer two - spaces
 */

// Initialze source data
var spacesSource = new carto.source.SQL('SELECT * FROM espacos');

// Create style for the data
var spacesStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #16fc73;
  polygon-opacity: .7;
  }
`);

// Add style to the data
var spacesLayer = new carto.layer.Layer(spacesSource, spacesStyle, {
  featureClickColumns: ['cartodb_id', 'name','tipo']
});


var popup = L.popup();
spacesLayer.on('featureClicked', function (event) {
  
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h9>' + event.data['tipo'] + '</h9>';
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

/*
 * Begin layer four - income 
 */

// Initialze source data
var incomeSource = new carto.source.SQL('SELECT * FROM renda_raca_brasilia_1');

// Create style for the data
var incomeStyle = new carto.style.CartoCSS(`
 #layer {
  polygon-fill: ramp([rend_rnm], (#ffd9b8, #ff9846, #e66d00, #c25c00, #a04c01), jenks);
  polygon-opacity: 0.7;
}
#layer::outline {
  line-width: 1;
  line-opacity: 0;
}
`);
// Add style to the data
var incomeLayer = new carto.layer.Layer(incomeSource, incomeStyle);
incomeLayer.hide();

/*
 * Begin layer - density
 */

// Initialze source data
var densitySource = new carto.source.SQL('SELECT * FROM density_eduarda');

// Create style for the data
var densityStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([density], (#ffd9b8, #ff9846, #e66d00, #c25c00, #a04c01), jenks);
  polygon-opacity: 0.8;
}
#layer::outline {
  line-width: 1;
  line-color: #ffffff;
  line-opacity: 0;
}
`);
// Add style to the data
var densityLayer = new carto.layer.Layer(densitySource, densityStyle);
densityLayer.hide();

/*
 * Begin layer - Race
 */

// Initialze source data
var raceSource = new carto.source.SQL('SELECT * FROM renda_raca_brasilia_1');

// Create style for the data
var raceStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([perblack], (#ffd9b8, #ff9846, #e66d00, #c25c00, #a04c01), jenks);
  polygon-opacity: 0.8;
}
#layer::outline {
  line-width: 0;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);
// Add style to the data
var raceLayer = new carto.layer.Layer(raceSource, raceStyle);
raceLayer.hide();


/*
 * Begin layer five - bus stops
 */

// Initialze source data
var busSource = new carto.source.SQL('SELECT * FROM pontos_parada')

// Create style for the data
var busStyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 3;
  marker-fill: #fe008b;
  marker-fill-opacity: 1;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/square-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-opacity: 0;
 [zoom >= 13] {
    marker-fill-opacity: 1;
    marker-line-opacity: 0;
    marker-width: 10;
}
}
`);
// Add style to the data
var busLayer = new carto.layer.Layer(busSource, busStyle);
busLayer.hide();

/*
 * Begin layer six - bike share
 */

// Initialze source data
var bikeSource = new carto.source.SQL('SELECT * FROM bikeshare_bsb')

// Create style for the data
var bikeStyle = new carto.style.CartoCSS(`
  #layer {
  marker-width: 10;
  marker-fill: #b91a66;
  marker-fill-opacity: 1;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/bicycle-18.svg');
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-opacity: 0;
 [zoom >= 13] {
    marker-fill-opacity: 1;
    marker-line-opacity: 1;
    marker-width: 20;
}
}
`);
// Add style to the data
var bikeLayer = new carto.layer.Layer(bikeSource, bikeStyle);
bikeLayer.hide();

/*
 * Begin layer seven - subway line
 */

// Initialze source data
var subwaySource = new carto.source.SQL('SELECT * FROM metroline')

// Create style for the data
var subwayStyle = new carto.style.CartoCSS(`
 #layer {
  line-width: 3px;
  line-color: #961863;
  line-opacity: 0.8;
  line-dasharray: 5, 5;
}
`);
// Add style to the data
var subwayLayer = new carto.layer.Layer(subwaySource, subwayStyle);
subwayLayer.hide();


/*
 * Begin layer - Land Use
 */

// Initialze source data
var landuseSource = new carto.source.SQL('SELECT * FROM diversidade_de_usos_2');

// Create style for the data
var landuseStyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([usos_iptu_], (#f9f206, #fe008b, #a11bef, #ff7800, #39aaf6, #ffffff), ("residencial", "comercio_servicos", "industrial_garag", "uso_misto", "institucional_lazer"), "=");
  polygon-opacity: 1;
}
#layer::outline {
  line-width: 0;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}
`);
// Add style to the data
var landuseLayer = new carto.layer.Layer(landuseSource, landuseStyle);
landuseLayer.hide();

/*
 * Begin layer - Land Use
 */

// Initialze source data
var lazerSource = new carto.source.SQL('SELECT * FROM esporte_lazer');

// Create style for the data
var lazerStyle = new carto.style.CartoCSS(`
#layer {
  marker-width: 16;
  marker-fill: ramp([tipo_mobil], (#fe008b, #fcb008, #d777f7, #8c30c1, #f9e70b, #00ff18, #b1fc4f, #600ea0, #ad670b, #ea54ad, #B3B3B3), ("PARQUE INFANTIL", "QUADRA POLIESPORTIVA", "PEC", "APARELHO DE GINASTICA", "QUADRA DE AREIA", "CAMPO SINTETICO", "CAMPO ILUMINADO", "SKATE PARK", "CAMPO TERRA BATIDA", "ANFITEATRO"), "=");
  marker-fill-opacity: 1;
  marker-file: ramp([tipo_mobil], (url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg'), url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/star-18.svg')), ("PARQUE INFANTIL", "QUADRA POLIESPORTIVA", "PEC", "APARELHO DE GINASTICA", "QUADRA DE AREIA", "CAMPO SINTETICO", "CAMPO ILUMINADO", "SKATE PARK", "CAMPO TERRA BATIDA", "ANFITEATRO"), "=");
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
  marker-comp-op: darken;
[zoom >= 13] {
    marker-fill-opacity: 1;
    marker-line-opacity: 0;
    marker-width: 15;
}
[zoom >= 20] {
    marker-fill-opacity: 1;
    marker-line-opacity: 0;
    marker-width: 20;
}
}
`);
// Add style to the data
var lazerLayer = new carto.layer.Layer(lazerSource, lazerStyle, {
  featureClickColumns: ['tipo_mobil', 'iluminac_p', 'endereco']
});
lazerLayer.hide();


var popup = L.popup();
lazerLayer.on('featureClicked', function (event) {
  
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h10>' + event.data['tipo_mobil'] + '</h10>';
  content += '<h11>Endereço: ' + event.data['endereco'] + ' <h11>';
  popup.setContent(content);
  
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
  map.setView([event.latLng.lat, event.latLng.lng], 15);
});

  



// Add the data to the map as two layers. Order matters here--first one goes on the bottom
client.addLayers([densityLayer, incomeLayer, raceLayer, landuseLayer, busLayer, bikeLayer, subwayLayer, spacesLayer,lazerLayer, casestudiesLayer]);
client.getLeafletLayer().addTo(map);


// Step 1: Find the search input by class. If you are using a different class, change this.
var neighborhoodSearch = document.querySelector('.neighborhood-search');

// Step 2: Add an event listener to the input. We will run some code whenever the text changes.
neighborhoodSearch.addEventListener('keyup', function (e) {
  // The value of the input is in e.target.value when it changes
  var searchText = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (searchText === '') {
    // If the search text is empty, then we show all of the features, unfiltered
    casestudiesSource.setQuery("SELECT * FROM case_studies_edited");
  }
  else {
    // Else use the search text in an SQL query that will filter to names with that text in it
    casestudiesSource.setQuery("SELECT * FROM case_studies_edited WHERE ra ILIKE '%" + searchText + "%'");
  }

  // Zoom to the latitude and longitude of the clicked feature
  // map.setView([e.latLng.lat, e.latLng.lng], 15);

  // EB:
  //  We need to fetch the data from Carto using the SQL API, then ask it for the bounds of the data.
  //  The first line asks Carto for a GeoJSON file of the selected data.
  //  Once we have the data, we find out what its bounds are (getBounds) and tell the map to fit itself to those bounds.
  fetch('https://eduardaaun.carto.com/api/v2/sql?format=geojson&q=' + encodeURIComponent(casestudiesSource.getQuery()))
    .then(function (response) { return response.json(); })
    .then(function (data) {
      map.fitBounds(L.geoJson(data).getBounds());
    });
  
  // Sometimes it helps to log messages, here we log the search text. You can see this if you open developer tools and look at the console.
  console.log('Input changed to "' + searchText + '"');
});

/*
 * Listen for changes on the layer picker - action picker 
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var actionPicker = document.querySelector('.action-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
actionPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var activity = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (activity === 'all') {
    casestudiesLayer.show();
    // If the value is "all" then we show all of the features, unfiltered
    casestudiesSource.setQuery("SELECT * FROM case_studies_edited");
  }
  else if (activity === 'none'){
    casestudiesLayer.hide();
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    casestudiesSource.setQuery("SELECT * FROM case_studies_edited WHERE activity = '" + activity + "'");
    casestudiesLayer.show();
    // console.log("no")

    // occupationsSource.setQuery("SELECT * FROM case_studies_edited WHERE activity = " + activity + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + activity + '"');
});

/*
 * Listen for changes on the layer picker - space picker 
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var spacePicker = document.querySelector('.space-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
spacePicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var tipo = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (tipo === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    spacesSource.setQuery("SELECT * FROM espacos");
  }
   else if (tipo === 'none'){
    spacesLayer.hide();
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    spacesSource.setQuery("SELECT * FROM espacos WHERE tipo = '" + tipo + "'");
    spacesLayer.show();
    // console.log("no")

    // occupationsSource.setQuery("SELECT * FROM case_studies_edited WHERE activity = " + activity + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + tipo + '"');
});

/*
 * Listen for changes on the layer picker - time picker 
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var timePicker = document.querySelector('.time-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
timePicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var temp_perm = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (temp_perm === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
   casestudiesSource.setQuery("SELECT * FROM case_studies_edited");
  }
  else if (temp_perm === 'none'){
    casestudiesLayer.hide();
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    casestudiesSource.setQuery("SELECT * FROM case_studies_edited WHERE temp_perm = '" + temp_perm + "'");
    casestudiesLayer.show();
    // console.log("no")

    // occupationsSource.setQuery("SELECT * FROM case_studies_edited WHERE activity = " + activity + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + temp_perm + '"');
});

// When the density button is clicked, show or hide the layer
var densityCheckbox = document.querySelector('.density-checkbox');
var densityLegend = document.querySelector('.legend-density');
densityCheckbox.addEventListener('click', function () {
  if (densityCheckbox.checked) {
    densityLayer.show();
    densityLegend.style.display = 'block';
  }
  else {
    densityLayer.hide();
    densityLegend.style.display = 'none';
  }
});

// Keep track of whether the INCOME layer is currently visible
var incomeVisible = true;

// When the income button is clicked, show or hide the layer
var incomeCheckbox = document.querySelector('.income-checkbox');
var incomeLegend = document.querySelector('.legend-income');
incomeCheckbox.addEventListener('click', function () {
 if (incomeCheckbox.checked) {
   incomeLayer.show();
   incomeLegend.style.display = 'block';
  }
  else {
  incomeLayer.hide();
    incomeLegend.style.display = 'none';
  }
});

// When the race button is clicked, show or hide the layer
var raceCheckbox = document.querySelector('.race-checkbox');
var raceLegend = document.querySelector('.legend-race');
raceCheckbox.addEventListener('click', function () {
  if (raceCheckbox.checked) {
    raceLayer.show();
    raceLegend.style.display = 'block';
  }
  else {
    raceLayer.hide();
    raceLegend.style.display = 'none';
  }
});
// Keep track of whether the BUS layer is currently visible
var busVisible = true;

// When the bus button is clicked, show or hide the layer
var busCheckbox = document.querySelector('.bus-checkbox');
var busLegend = document.querySelector('.legend-access');
busCheckbox.addEventListener('click', function () {
 if (busCheckbox.checked) {
   busLayer.show();
   bikeLayer.show();
   subwayLayer.show();
   busLegend.style.display = 'block';
  }
  else {
  busLayer.hide();
  bikeLayer.hide();
  subwayLayer.hide();
    busLegend.style.display = 'none';
  }
});

// Keep track of whether the LAND USE layer is currently visible
var landuseVisible = true;

// When the  land use button is clicked, show or hide the layer
var landuseCheckbox = document.querySelector('.landuse-checkbox');
var landuseLegend = document.querySelector('.legend-landuse');
landuseCheckbox.addEventListener('click', function () {
 if (landuseCheckbox.checked) {
   landuseLayer.show();
   landuseLegend.style.display = 'block';
  }
  else {
  landuseLayer.hide();
  landuseLegend.style.display = 'none';
  }
});

// Keep track of whether the INCOME layer is currently visible
var lazerVisible = true;

// When the income button is clicked, show or hide the layer
var lazerCheckbox = document.querySelector('.lazer-checkbox');
var lazerLegend = document.querySelector('.legend-lazer');
lazerCheckbox.addEventListener('click', function () {
 if (lazerCheckbox.checked) {
   lazerLayer.show();
   lazerLegend.style.display = 'block';
  }
  else {
 lazerLayer.hide();
    lazerLegend.style.display = 'none';
  }
});

// Make SQL to get the summary data you want
var countSql = 'SELECT COUNT(*) FROM case_studies_edited';

// Request the data from Carto using the reqwest library (you also need to load this in the HTML).
// You will need to change 'brelsfoeagain' below to your username, otherwise this should work.
reqwest('https://eduardaaun.carto.com/api/v2/sql/?q=' + countSql, function (response) {
  // All of the data returned is in the response variable
  console.log(response);

  // The sum is in the first row's sum variable
  var count = response.rows[0].count;

  // Get the sidebar container element
  var sidebar = document.querySelector('.sidebar-feature-content');

  // Add the text including the sum to the sidebar
  sidebar.innerHTML = '<h3>' + count + ' espaços públicos</div>';
});

var sidebarbutton = document.querySelector('.sidebar-button');
sidebarbutton.addEventListener('click', function () {
  var sidebarcontent = document.querySelector('.sidebar-content');
  var panelClose = document.querySelector('.panel-close');
  sidebarcontent.style.display = 'block';
  panelClose.style.display = 'block';
})

var panelClose = document.querySelector('.panel-close');
panelClose.addEventListener('click', function () {
  var sidebarcontent = document.querySelector('.sidebar-content');
  var panelClose = document.querySelector('.panel-close');
  sidebarcontent.style.display = 'none';
  panelClose.style.display = 'none';
})

function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read more"; 
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read less"; 
    moreText.style.display = "inline";
  }
}

