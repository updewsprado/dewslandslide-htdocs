
$(document).ready(function(e) {
	$(document).ajaxStart(function () {
		$('#loading').modal('toggle');
	});
	$(document).ajaxStop(function () {
		$('#loading').modal('toggle');
	});

	$.get("../api/AllSiteDetails").done(function(data){
		var all_sites_details = JSON.parse(data);
		var map_pins=[]
		for (i = 0; i < all_sites_details.length; i++) {
			map_pins.push([parseFloat(all_sites_details[i].lat) ,parseFloat(all_sites_details[i].lon),all_sites_details[i].name])
		}
		getAllData(map_pins)
	})


	function getAllData(map_pins) {
		$.get("../api_testing/EarthquakeEvent/2017-06-01%2013:30:00/2017-06-02%2013:30:00").done(function(data){
			var all_earthquake_details = JSON.parse(data);
			initMap(map_pins,all_earthquake_details)
		})

	}

	function initMap(map_pins,data) {


		// var citymap = {
		// 	chicago: {
		// 		center: {lat: 11.310000, lng: 122.910000},
		// 		population: 14.195*1000
		// 	},

		// };
		var map = new google.maps.Map(document.getElementById('maps'), {
			zoom: 6,
			center: new google.maps.LatLng(11.8978,121.9094),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		for (a = 0; a < map_pins.length; a++) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng( map_pins[a][0],map_pins[a][1]),
				map: map
			});
		}


		for (var i = 0; i < data.length; i++) {
			var cityCircle = new google.maps.Circle({
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: map,
				center: new google.maps.LatLng(data[i].latitude,data[i].longitude),
				radius: data[i].critical_distance * 1000
			});
		}
		
	}
});

