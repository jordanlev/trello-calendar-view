# Trello Calendar View
This is a simple tool that displays high-level project milestones in a responsive calendar layout.

It assumes a different workflow than most Trello boards, in that each list is considered a separate project (as opposed to the recommended Trello usage where lists are for different phases of the same project).

# Installation
Plop the files on a server somewhere (could even be your localhost if you have a web server running locally), and visit index.html in your browser. Everything is handled via javascript on the front-end, so no server-side setup is required (no php, no node.js, no rails, no nuthin').

# Todo
* Work with boards on a per-organization basis, not per-user
* Show the user(s) assigned to each card, and maybe allow filtering the calendar on user(s)
* Allow default settings to be passed in (for example, `index.html?weeks=4` would default the calendar view setting to show 4 weeks)
* Display a continuous "bar" of color from the start of a project through to the end (will require a lot of css trickery)
* Add button to refresh calendar display (but without changing the project colors)... so if new cards were added to trello board, those will be reflected. (~or~, if there's some way in the trello api to check for a "last overall change date", check that from time to time and auto-reload periodically)