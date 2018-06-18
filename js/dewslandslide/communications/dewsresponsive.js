$(document).ready(function() {

	autoresize();

	$(window).on('resize',function(){
		autoresize();
	});

	function autoresize(){
		var division_height = $(window).height()-120;
		$('.division').css({"height": division_height});
		$('.division').css({"max-height": division_height});
		$('#quick-inbox-display').css({"height": division_height-158});
		$('#quick-inbox-unknown-display').css({"height": division_height-158});
		$('#quick-release-display').css({"height": division_height-219});
		$('.chat-message').css({"height": division_height-308});
	}
});