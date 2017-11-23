$(document).ready(function(e) {
	loadAllStaff();
});


function loadAllStaff() {

		$.get( "../staff/get_all_staff", function( data ) {
			var staff_data = JSON.parse(data);
			var panel_counter = 0;
			var temp = "";
			var temp_array = [];
			var teams = [];
			var flag = 0;

			for (var counter = 0; counter < staff_data.length; counter++) {
				if (temp == "") {
					temp = staff_data[counter].team_name;
					if (temp == staff_data[counter].team_name) {
						temp_array.push(staff_data[counter]);
					}
				} else {
					if (temp == staff_data[counter].team_name) {
						temp_array.push(staff_data[counter]);
					} else {
						teams.push(temp_array);
						console.log(teams);
						temp = staff_data[counter].team_name;
						temp_array = [];
						if (temp == staff_data[counter].team_name) {
							temp_array.push(staff_data[counter]);
						}
					}
				}
			}

			console.log(teams);

			for (var counter = 0; counter < teams.length; counter++) {
				$('.staff-wrapper').append('<div class="panel panel-primary">'+
					'<div class="panel-heading"><h4>'+teams[counter][0].team_name+'</h4></div>'+
					'<div class="row staff-container row-'+counter+'-'+teams[counter][0].team_name+'-team">'+
					'<div class="col-sm-12 flag-'+flag+'">'+
					'</div>'+
					'</div>'+
					'</div>');

				for (var sub_counter = 0; sub_counter < teams[counter].length; sub_counter++) {
					$('.row-'+counter+'-'+teams[counter][0].team_name+'-team .col-sm-12').append('<div class="col-sm-3 staff-profile">'+
						'<img src="../../images/staff_photos/'+teams[counter][sub_counter].fk_mid+'.jpg" class="img-thumbnail img-responsive">'+
						'<div class="staff-name">'+teams[counter][sub_counter].full_name+'</div>'+
						'<div class="staff-attainment">'+teams[counter][sub_counter].education_attainment+'</div>'+
						'<div class="staff-position">'+teams[counter][sub_counter].position+'</div></div>');
					flag++;
					// if (flag > 4) {
					// 	$('.row-'+sub_counter+teams[counter][0].team_name+'-team').append('<div class="row staff-container">'+
					// 	'<div class="col-sm-12 '+teams[counter][0].team_name+'-team">'+
					// 	'</div>'+
					// 	'</div>'+
					// 	'</div>');
					// 	flag = 0;
					// 	$('.row-'+sub_counter+teams[counter][0].team_name+'-team').append('<div class="col-sm-3 staff-profile row-'+sub_counter+teams[counter][0].team_name+'-team">'+
					// 	'<img src="../../images/staff_photos/'+teams[counter][sub_counter].fk_mid+'.jpg" class="img-thumbnail img-responsive">'+
					// 	'<div class="staff-name">'+teams[counter][sub_counter].full_name+'</div>'+
					// 	'<div class="staff-attainment">'+teams[counter][sub_counter].education_attainment+'</div>'+
					// 	'<div class="staff-position">'+teams[counter][sub_counter].position+'</div></div>');
					// 	flag++;
					// }
					if (flag > 4) {
						$('.row-'+counter+'-'+teams[counter][0].team_name+'-team flag-'+flag).append('<div class="col-sm-12">'+
					'</div>');
						flag = 0;
					}
				}
			}

		});

	// <div class="panel panel-primary">
	// 	  <div class="panel-heading"><h4>Team name</h4></div>
	// 		<div class="panel-body">
	// 			<div class="row staff-container">
	// 				<div class="col-sm-12">
	// 					<div class="col-sm-3 staff-profile">
	// 						<img src="../../images/staff_photos/56.jpg" class="img-thumbnail img-responsive">
	// 						<div class="staff-name">Geliberte, John D.</div>
	// 						<div class="staff-position">Science Research Specialist II</div>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
}