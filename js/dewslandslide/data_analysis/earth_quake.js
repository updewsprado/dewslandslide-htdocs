$(document).ajaxStart(function () {
	$('#loading').modal('toggle');
});
$(document).ajaxStop(function () {
	$('#loading').modal('toggle');
});

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
		var citymap = {
		chicago: {
			center: {lat: 41.878, lng: -87.629},
			population: 2714856
		},
		newyork: {
			center: {lat: 40.714, lng: -74.005},
			population: 8405837
		},
		losangeles: {
			center: {lat: 34.052, lng: -118.243},
			population: 3857799
		},
		vancouver: {
			center: {lat: 49.25, lng: -123.1},
			population: 603502
		}
	};
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

		for (var city in citymap) {
          var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: citymap[city].center,
            radius: Math.sqrt(citymap[city].population) * 100
        });
      }
	}
});

