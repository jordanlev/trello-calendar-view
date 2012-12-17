var CARD_IS_DONE_LABEL = 'Done'; //name of the trello label applied to cards marked as "done"

function loadBoards(callback) {
	Trello.get('members/me/boards?filter=open', function(boards) {
		var simplifiedBoards = _.map(boards, function(board) {
			return {'id': board.id, 'name': board.name}
		});
		callback(simplifiedBoards);
	});
}

function loadProjectData(boardId, callback) {
	
	var projects = new ProjectData();
	
	Trello.get('boards/' + boardId + '/lists', function(lists) {

		_.each(lists, function(list) {
			projects.addProject(list);
		});
		
		Trello.get('boards/' + boardId + '/cards', function(cards) {
			
			_.each(cards, function(card) {
				projects.addEvent(card);
			});
			
			callback(projects);
		});
		
	});
}

var ProjectData = function() {
	var projectData = {};
	var orderedProjectIds = [];
	var isDirty = true; //denotes if we haven't cleaned and sorted data since the last project or event was added
	var colors = new ColorPicker();
	
	this.addProject = function(trelloList) {
		projectData[trelloList.id] = {
			'id': trelloList.id,
			'name': trelloList.name,
			'color': colors.getColor(),
			'events': []
		}
		
		orderedProjectIds.push(trelloList.id);
		
		isDirty = true;
	}
	
	this.addEvent = function(trelloCard) {
		if (trelloCard.due != null) {
			projectData[trelloCard.idList].events.push({
				'id': trelloCard.id,
				'projectId': trelloCard.idList,
				'due': moment(trelloCard.due, 'YYYY-MM-DD\\THH:mm:ss.SSS\\Z'),
				'pos': trelloCard.pos,
				'name': trelloCard.name,
				'desc': trelloCard.desc,
				'url': trelloCard.url,
				'done': isCardDone(trelloCard)
			});
		}
		
		isDirty = true;
	}
	
	this.getProjects = function() {
		cleanAndSortData();
		return _.map(orderedProjectIds, function(id) { return projectData[id]; });
	}
	
	this.getEvents = function(projectId) {
		cleanAndSortData();
		if (typeof projectId === 'undefined') {
			//return all projects' events, in one combined array
			return _.reduce(projectData, function(events, project) { return events.concat(project.events); }, []);
		} else {
			return projectData[projectId].events;
		}
	}
	
	cleanAndSortData = function() {
		if (!isDirty) {
			return;
		}
		
		//remove projects having no dated events
		orderedProjectIds = _.filter(orderedProjectIds, function(projectId) {
			return projectData[projectId].events.length;
		});
		projectData = _.pick(projectData, orderedProjectIds); //can't use _.filter here, because it returns an array (not an object)!

		//sort each project's events by date (and trello pos within each day)
		_.each(projectData, function(project) {
			project.events.sort(function(a,b) {
				var a_date = a.due.format('YYYMMDD');
				var b_date = b.due.format('YYYMMDD');
	
				if (a_date == b_date) {
					return parseInt(a.pos) - parseInt(b.pos);
				} else {
					return parseInt(a_date) - parseInt(b_date);
				}
			});
		});
	}
	
	isCardDone = function(trelloCard) {
		return _.some(trelloCard.labels, function(label) {
			return (label.name == CARD_IS_DONE_LABEL);
		});
	}
}

var ColorPicker = function() {
	this.getColor = function() {
		if (!colors.length) {
			return 'black';
		}

		var randomIndex = Math.floor(Math.random() * colors.length);
		var color = colors[randomIndex];
		colors.splice(randomIndex, 1); //remove color from master list
		return color;
	}
	
	var colors = [
		"aliceblue",
		"antiquewhite",
	//	"aqua",
		"aquamarine",
		"azure",
		"beige",
		"bisque",
	//	"black",
		"blanchedalmond",
	//	"blue",
	//	"blueviolet",
	//	"brown",
		"burlywood",
		"cadetblue",
	//	"chartreuse",
		"chocolate",
		"coral",
		"cornflowerblue",
		"cornsilk",
	//	"crimson",
	//	"cyan",
	//	"darkblue",
		"darkcyan",
		"darkgoldenrod",
		"darkgray",
	//	"darkgreen",
		"darkkhaki",
	//	"darkmagenta",
		"darkolivegreen",
		"darkorange",
		"darkorchid",
	//	"darkred",
		"darksalmon",
		"darkseagreen",
	//	"darkslateblue",
	//	"darkslategray",
		"darkturquoise",
		"darkviolet",
		"deeppink",
		"deepskyblue",
		"dimgray",
		"dodgerblue",
		"firebrick",
		"floralwhite",
	//	"forestgreen",
	//	"fuchsia",
		"gainsboro",
		"ghostwhite",
		"gold",
		"goldenrod",
		"gray",
		"green",
		"greenyellow",
		"honeydew",
		"hotpink",
		"indianred",
	//	"indigo",
		"ivory",
		"khaki",
		"lavender",
		"lavenderblush",
		"lawngreen",
		"lemonchiffon",
		"lightblue",
		"lightcoral",
		"lightcyan",
		"lightgoldenrodyellow",
	//	"lightgray",            // IE6 breaks on this color
		"lightgreen",
		"lightpink",
		"lightsalmon",
		"lightseagreen",
		"lightskyblue",
		"lightslategray",
		"lightsteelblue",
		"lightyellow",
		"lime",
		"limegreen",
		"linen",
		"magenta",
	//	"maroon",
		"mediumaquamarine",
	//	"mediumblue",
		"mediumorchid",
		"mediumpurple",
		"mediumseagreen",
		"mediumslateblue",
		"mediumspringgreen",
		"mediumturquoise",
		"mediumvioletred",
	//	"midnightblue",
		"mintcream",
		"mistyrose",
		"moccasin",
		"navajowhite",
	//	"navy",
		"oldlace",
		"olive",
		"olivedrab",
		"orange",
		"orangered",
		"orchid",
		"palegoldenrod",
		"palegreen",
		"paleturquoise",
		"palevioletred",
		"papayawhip",
		"peachpuff",
		"peru",
		"pink",
		"plum",
		"powderblue",
	//	"purple",
	//	"red",
		"rosybrown",
		"royalblue",
		"saddlebrown",
		"salmon",
		"sandybrown",
		"seagreen",
		"seashell",
		"sienna",
		"silver",
		"skyblue",
		"slateblue",
		"slategray",
		"snow",
		"springgreen",
		"steelblue",
		"tan",
		"teal",
		"thistle",
		"tomato",
		"turquoise",
		"violet",
		"wheat",
	//	"white",
		"whitesmoke",
		"yellow",
		"yellowgreen"
	];
}
