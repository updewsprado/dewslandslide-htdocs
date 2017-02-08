$(document).ready(function(e) {
	$.get("../api/AllSiteDetails").done(function(data){
		var all_sites_details = JSON.parse(data);
		var map_pins=[]
		for (i = 0; i < all_sites_details.length; i++) {
			map_pins.push([parseFloat(all_sites_details[i].lat) ,parseFloat(all_sites_details[i].lon),all_sites_details[i].name])
		}
		initMap(map_pins)
	})

	function initMap(map_pins) {
		var map = new google.maps.Map(document.getElementById('map-canvas'), {
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
	}
});