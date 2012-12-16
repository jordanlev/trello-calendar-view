var priorDay = null; //so we know when to output month names when drawing the calendar (yeah, it's a global, but it greatly simplifies the code)

function calendarHtml(numberOfWeeks, daysPerWeek, firstDayOfWeek) { //firstDayOfWeek is number between 0-6 (Sunday-Saturday)
	var day = moment().day(firstDayOfWeek); //start with first day of current week
	var html = '';
	html += headerHtml(day, daysPerWeek);
	for (var week = 1; week <= numberOfWeeks; week++) {
		html += weekHtml(day, daysPerWeek);
		day.add('weeks', 1);
	};
	return html;
}

function headerHtml(firstDay, daysPerWeek) {
	var html = '';
	
	html += '<tr class="header">';
	var day = firstDay.clone(); //copy to local var so we don't mutate the passed-in object
	for (var dayOfWeek = 0; dayOfWeek < daysPerWeek; dayOfWeek++) {
		html += '<th>' + day.format('ddd') + '</th>';
		day.add('days', 1);
	}
	html += '</tr>';
	
	return html;
}

function weekHtml(firstDay, numberOfDays) {
	var html = '';
	
	html += '<tr class="week week-of-' + numberOfDays + '-days">';
	var day = firstDay.clone(); //copy to local var so we don't mutate the passed-in object
	for (var dayOfWeek = 0; dayOfWeek < numberOfDays; dayOfWeek++) {
		html += dayHtml(day);
		priorDay = day.clone();
		day.add('days', 1);
	};
	html += '</tr>';
	
	return html;
}

function dayHtml(day) {
	var tpl = _.template(''
		+ '<td class="day <%= pastClass %>" data-date="<%= dataDate %>">'
		+   '<div class="date"><%= displayDate %></div>'
		+ '</td>'
	);
	
	var data = {};
	
	var isPast = day.format('YYYYMMDD') < moment().format('YYYYMMDD');
	data.pastClass = isPast ? 'day-past' : '';
	
	data.dataDate = day.format('YYYY-MM-DD');
	
	var displayMonthName = (priorDay == null || day.month() != priorDay.month());
	var displayDateFormat = displayMonthName ? 'MMM D' : 'D';
	data.displayDate = day.format(displayDateFormat);
	
	return tpl(data);
}

function projectLegendHtml(projects) {
	var tpl = _.template(''
		+ '<% _.each(projects, function(project) { %>'
		+ '  <li class="project-<%= project.id %>">'
		+ '    <%- project.name %>'
		+ '  </li>'
		+ '<% }); %>'
	);
	return tpl({'projects': projects.getProjects()});
}

function projectColorsCss(projects) {
	var tpl = _.template(''
		+ '<% _.each(projects, function(project) { %>'
		+ '  .project-<%= project.id %> { background-color: <%- project.color %>; }'
		+ '<% }); %>'
	);
	return tpl({'projects': projects.getProjects()});
}

function putEventsOnCalendar(projects, $calendar) {
	var tpl = _.template(''
		+ '<div class="event project-<%= event.projectId %> <%= doneClass %>" title="<%- event.desc %>">'
		+   '<a href="<%= event.url %>" target="_blank"><%- event.name %></a>'
		+ '</div>'
	);
	
	_.each(projects.getEvents(), function(event) {
		var data = {
			'event': event,
			'doneClass': event.done ? 'event-done' : ''
		};
		var $day = $calendar.find('.day[data-date="' + event.due.format('YYYY-MM-DD') + '"]');
		var html = tpl(data);
		$day.append(html);
	});
}

