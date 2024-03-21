# TODO/Timeline

## Bugs/Issues

* ellipsis for text in long filenames in item preview
* url symbol for all previews
* Spacepreview close textpreview on "x" click

* close pdf on ESC; pdfjs is broken on space preview
* space preview transparent background?

* "Settings" screen: height of topbar
* Make URL clickable in right sidebar
* Quicksettings: show name, date changed etc
* rename files if item gets renamed?
* AddModal: "Tags" background hint text


* Intro wizard
    * choose save location
    * copy or link files
    * fill with example data?

* item preview for additem modal: action queue for external file previews - always show the preview not the icon. Create new when app starts

## Revised plan
•	Developing the application (01.06.24)
    o	✅ Cleanup and refactor codebase, fix some bugs
    o	Support different item types: video, PDF, audio, text and other
    o	✅ Support choosable preview images for bookmarks and videos
    o	(Re)write chrome extension
    o	Context menu, deletion modal
    o	User highlights: video timestamps, highlights in bookmarks
    o	Item order
•	Polishing the application (01.07.24)
    o	Fixes and improvements
    o	Improve styling
    o	Handle existing files and bookmarks (duplicates)
    o	Good changes I may have noticed after using the application myself.
    o	Testing
•	Showing to users (01.08.24)
    o	Simple landing page explaining the functionality.
    o	Research how to do interviews: Interview questions.
    o	Do the interviews.
    o	Evaluating the interviews
•	Implementing user feedback, fixing newly discovered bugs (01.09.24)
•	Writing the thesis (01.09.24)
    o	Creating a poster and video of the application
    o	More literature and existing application research
    o	Finalizing the thesis
 

## Initial plan 
* Initial literature review and assessments for this module
* cleanup and refactor codebase
* support different item types: pdf, groups, audio, text, other
* rewrite chrome extension
* top area: quicksettings, home and back buttons
* settings view
* user highlights: video timestamps, highlights in bookmarks
* item order
* bugs
* styling
* interviews
    * landing page for user evaluation
* handle existing files, make paths relative




Probably out of scope:
* Search
* Import view - better overview, indicator
* autogenerate type tags
* undo/redo



* transcode videos to a supported format ( e.g. :"m4v","mov","avi" into "mp4" or "webm" )

* item groups
    * group: icon indicating it is a group,  number of items in the group, user can choose the main item to be used as preview
* pdfs: preview of the first page
* other files: default icon or, if possible, a preview of the default icon/application on the user's system
* right click on an item opens a context menu: edit item, show file in finder, open in default application, open in browser, delete item

* main top area: settings
* details top area: "home" button, back button

* fix/limit settings view

* keyboard nav

* landing page for user evaluation

* users should be able to use the application without reading the documentation


* tag input bug
* Handle already existing files
* Make paths relative
* Item order
* Import - better overview, indicator
* Chrome extension


LIMITATIONS:

Ublock doesn't run, not completely everything is saved, e.g. fonts, embedded audio and video
Possibly problems with the highlights due to mhtml
No way to access the stuff using a mobile device
