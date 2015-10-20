// Rutvi Patel
// Challenge 3
// This is the corresponding javascript page for the map assignment

"use strict"
var map;

// This function draws the map by adding layers to tiles
var drawMap = function() {

  // Create map and set view
  	map = L.map('tiles').setView([39.8282, -98.5795], 4);
 

  // Create a tile layer variable using the appropriate url
  	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');


  // Add the layer to your map
 	layer.addTo(map);

  // Execute your function to get data
 	getData();
}

// Function for getting data by making an ajax request and 
// calling the customBuild function if the response is successful
var getData = function() {
	var arr = $.ajax({
	    url:'data/response.json',
	    type: "get",
	    success:function() {
	   		customBuild(arr.responseJSON);
	    }, 	
    	dataType:"json"
	}) ;
}

// This function builds the layers of vitim data by:
// 1) looping throught the data and creating a marker for
// each victim.
// 2) adding the markers into groups, and then adding them onto the map
// This function also keeps track of the data for the table
var customBuild = function(arr) {
	// data for the table
	var menWhite = 0;
	var womenWhite = 0;
	var menNonWhite = 0;
	var womenNonWhite = 0;

	// Layergroups initialization
	var Unknown = new L.LayerGroup([]);
	var White = new L.LayerGroup([]);
	var AA = new L.LayerGroup([]); //black or african american
	var Asian = new L.LayerGroup([]);
	var AI = new L.LayerGroup([]); // American Indian or Alaskan Native
	var NH = new L.LayerGroup([]); // Native Hawaiian 
	
	for (var i = 0; i < arr.length; i++) {
		var status = arr[i]['Hit or Killed?'];
		var fill = 'grey';
		if (status == "Hit") {
			fill = 'blue';
		} else if (status == 'Killed') {
			fill = 'red';
		}
		var circle = new L.circleMarker([arr[i].lat, arr[i].lng], 50000);
		circle.setStyle({
			color:'black',
			fillColor: fill
		});

		// brings up popup when hovering over the marker
		circle.bindPopup(arr[i].Summary);
        circle.on('mouseover', function (e) {
            this.openPopup();
        });
       
		var race = arr[i].Race;
		var gender = arr[i]["Victim's Gender"];
		if (race == "Unknown") {
			circle.addTo(Unknown);
		} else if (race == "White") {
			circle.addTo(White);
			// adds white men and women to the table data
			if (gender == "Male") {
				menWhite++;
			} else { // In cases of undefined as well
				womenWhite++;
			}
		} else if (race == "Black" || race == "African American") {
			circle.addTo(AA);
	
		} else if (race == "Asian") {
			circle.addTo(Asian);
			
		} else if (race == "American Indian" || "Alaskan Native") {
			circle.addTo(AI);
			
		} else if (race == "Native Hawaiian" || "Other Pacific Islander") {
			circle.addTo(NH);	
		}
		// adds non-white men and women to the table data
		if (gender == "Male") {
				menNonWhite++;
		} else { // In cases of undefined as well
			womenNonWhite++;
		}	
	}
	// adds layers to the map
	Unknown.addTo(map);
	White.addTo(map);
	AA.addTo(map);
	Asian.addTo(map);
	AI.addTo(map);
	NH.addTo(map);
	var blop = {"Unknown": Unknown, "White" : White, "Black or African American" : AA, 
		"Asian" : Asian, "American Indian or Alaskan Native" : AI, "Native Hawaiian or Other Pacific Islander" : NH};

	// creates a menu for which layers should show up
	L.control.layers(null, blop).addTo(map); 
	createTable(menWhite, menNonWhite, womenWhite, womenNonWhite);
}

// This function creates the table at the top of the map
var createTable = function(menWhite, menNonWhite, womenWhite, womenNonWhite) {
	$('#data1').text(menWhite);
	$('#data2').text(womenWhite);
	$('#data3').text(menNonWhite);
	$('#data4').text(womenNonWhite);
}


