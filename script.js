// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map', {
  zoomControl: false
}).setView([-15.794236, -47.883568,], 11);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/eduardaaun/cje7b2cg93v4x2so2t3pnsvog/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWR1YXJkYWF1biIsImEiOiJjajI1OWQ4b3kwMDhtMzJsZWdmOHhocWFpIn0.dM0AOmAI9UmpTcD6J8jNKw', {
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
  marker-fill: ramp([people], (#ed208a, #16fc73, #b10cff, #ff7800), ("cultural producer", "community organization", "urban experts", "activists"), "=");
  marker-fill-opacity: .6;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #ffffff;
  marker-line-opacity: 0;
}
`);

// Add style to the data
var casestudiesLayer = new carto.layer.Layer(casestudiesSource, casestudiesStyle, {
  featureClickColumns: ['cartodb_id', 'atividade','activity','organizado', 'name', 'descriptio','_when', 'local','foto','foto_2', 'foto_3','contact',],
  featureOverColumns: ['cartodb_id', 'atividade','activity','organizado', 'name', 'descriptio','_when', 'local','foto','foto_2', 'foto_3','contact',]
});

casestudiesLayer.on('featureClick', function (event) {
   var content = '<h7>' + event.data['name'] + '</h7>'
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
  var content = '<h7>' + event.data['name'] + '</h7>'
  content += '<h4>' + event.data['atividade'] + ' <h4>';
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
  
  if (event.data ['_when'] == null) {
    content += '<div></div>';
  }
  else {
  content += '<div>Quando: ' + event.data['_when'] + ' </div>';
  }
  content += '<a href="' + event.data['contact'] + '" target="_blank"> Mais informação </a>';
  
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
  polygon-fill: black;
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
  var content = '<h7>' + event.data['name'] + '</h7>'
    content += '<div>' + event.data['tipo'] + ' </div>';
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
  polygon-fill: ramp([rend_rnm], (#b25400, #e46c00, #ff7800, #ff8b24, #ffa554), quantiles);
  polygon-opacity: 0.8;
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
  polygon-fill: ramp([density], (#ffd4af, #ffa24f, #ff7a04, #ff7800, #ab5100), jenks);
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
 * Begin layer five - bus stops
 */

// Initialze source data
var busSource = new carto.source.SQL('SELECT * FROM pontos_parada')

// Create style for the data
var busStyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 10;
  marker-fill: #16fc73;
  marker-fill-opacity: 1;
  marker-file: url('https://s3.amazonaws.com/com.cartodb.users-assets.production/maki-icons/bus-18.svg');
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
  marker-fill: #16fc73;
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
  line-color: #16fc73;
  line-opacity: 0.5;
}
`);
// Add style to the data
var subwayLayer = new carto.layer.Layer(subwaySource, subwayStyle);
subwayLayer.hide();


// Add the data to the map as two layers. Order matters here--first one goes on the bottom
client.addLayers([densityLayer, incomeLayer, busLayer, bikeLayer, subwayLayer, spacesLayer, casestudiesLayer]);
client.getLeafletLayer().addTo(map);


/*
 * Listen for changes on the layer picker - people picker 
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var peoplePicker = document.querySelector('.people-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
peoplePicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var people = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (people === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    casestudiesSource.setQuery("SELECT * FROM case_studies_edited");
  }
  else if (people === 'none'){
    casestudiesLayer.hide();
  }
  else {
 casestudiesSource.setQuery("SELECT * FROM case_studies_edited WHERE people = '" + people + "'");
 casestudiesLayer.show();
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + people+ '"');
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
// Keep track of whether the BUS layer is currently visible
var busVisible = true;

// When the bus button is clicked, show or hide the layer
var busCheckbox = document.querySelector('.bus-checkbox');
var busLegend = document.querySelector('.legend-access');
busCheckbox.addEventListener('click', function () {
 if (busCheckbox.checked) {
   busLayer.show();
   busLegend.style.display = 'block';
  }
  else {
  busLayer.hide();
    busLegend.style.display = 'none';
  }
});

// Keep track of whether the BIKE layer is currently visible
var bikeVisible = true;

// When the bike button is clicked, show or hide the layer
var bikeCheckbox = document.querySelector('.bike-checkbox');
var bikeLegend = document.querySelector('.legend-access');
bikeCheckbox.addEventListener('click', function () {
 if (bikeCheckbox.checked) {
   bikeLayer.show();
   bikeLegend.style.display = 'block';
  }
  else {
  bikeLayer.hide();
  bikeLegend.style.display = 'none';
  }
});

// Keep track of whether the SUBWAY layer is currently visible
var subwayVisible = true;

// When the subway button is clicked, show or hide the layer
var subwayCheckbox = document.querySelector('.subway-checkbox');
var subwayLegend = document.querySelector('.legend-access');
subwayCheckbox.addEventListener('click', function () {
 if (subwayCheckbox.checked) {
   subwayLayer.show();
   subwayLegend.style.display = 'block';
  }
  else {
  subwayLayer.hide();
  subwayLegend.style.display = 'none';
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

