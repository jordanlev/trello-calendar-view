var trelloData = null;

/*** Trello login stuff ***/
	$(document).ready(function() {
		$('#login a').on('click', function() {
			Trello.authorize({
				 type: "popup",
				 success: onLogin
			});
			return false;
		});
 
		$('#logout a').on('click', function() {
			Trello.deauthorize();
			updateLoggedIn();
			return false;
		});
	
		//If user is still logged in from before, automatically authorize Trello now
		Trello.authorize({
			interactive:false,
			success: onLogin
		});
	});

	function updateLoggedIn() {
		var isLoggedIn = Trello.authorized();
		$("#login").toggle(!isLoggedIn);
		$("#header").toggle(isLoggedIn);
	};


	function onLogin() {
		updateLoggedIn();
		$('#loading').show();
	
		loadBoards(function(boards) {
			var tpl = _.template(''
				+ '<option value="">&lt;Choose&gt;</option>'
				+ '<% _.each(boards, function(board) { %>'
				+ '  <option value="<%= board.id %>">'
				+ '    <%- board.name %>'
				+ '  </option>'
				+ '<% }); %>'
			);
			var html = tpl({'boards': boards});
			$('#boards select').html(html);
			$('#loading').hide();
		});
	}


/*** Load data upon board selection ***/
	$(document).ready(function() {
		$('#boards select').on('change', function() {
			var val = $(this).val();
			if (val.length) {
				loadProjects(val, drawCalendar);
			}
		});
	});

	function loadProjects(boardId, callback) {
		$('#loading').show();
		$('#projects').hide();
		$('#boards').hide();
		document.title = $('#boards select option[value="' + boardId + '"]').html();
		loadProjectData(boardId, function(projects) {
			trelloData = projects;
			drawLegend();
			$('#legend').show();
			$('#projects').show();
			callback();
		});
	}

	function drawLegend() {
		$('<style type="text/css"></style>').html(projectColorsCss(trelloData)).appendTo('head');
		$('#legend ul').html(projectLegendHtml(trelloData));
	}



/*** Draw the calendar ***/
	$(document).ready(function() {
		$('#numberOfWeeks, #daysPerWeek, #firstDayOfWeek').on('change', drawCalendar);
	});
	function drawCalendar() {
		if (trelloData == null) {
			return;
		}
	
		$('#loading').show();
		var numberOfWeeks = parseInt($('#numberOfWeeks').val());
		var daysPerWeek = parseInt($('#daysPerWeek').val());
		var firstDayOfWeek = parseInt($('#firstDayOfWeek').val());
		$('#calendar').html(calendarHtml(numberOfWeeks, daysPerWeek, firstDayOfWeek));
		putEventsOnCalendar(trelloData, $('#calendar'));
		$('#loading').hide();
	}
