$(document).ready(function() {
	var division_height = $(window).height()-120;
	console.log($(window).height());
	console.log(division_height);
	$('.division').css({"height": division_height});
	$('#quick-inbox-display').css({"height": division_height-188});
	$('#unknown').css({"height": division_height-188});
	$('.chat-message').css({"height": division_height-363});
});