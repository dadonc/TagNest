# TODO/Timeline

Then:
orderBy:
* update fileSize, dateUpdated on text item change and on hover of external files (if changed, update updatedAt) 

* make queue in electron code to update items in the database based on the files in the filesystem

## Bugs
* hovering over PDF preview changes layout
* right sidebar 
    - decrease preview size
    - preview external files and pdfs
    

* colors video: bg hover time (light), bg progressbar (dark)


* tag input bug, "Tags" background hint text
* close pdf on ESC; pdfjs is broken on space preview

* main grid scrollbar is inside the rightmost items




## Revised plan
•	Developing the application (01.06.24)
    o	✅ Cleanup and refactor codebase, fix some bugs
    o	✅ Support different item types: video, PDF, audio, text and other
    o	✅ Support choosable preview images for bookmarks and videos
    o	(Re)write chrome extension
    o	Context menu, deletion modal
    o	User highlights: video timestamps, highlights in bookmarks, preview in left sidebar
    o	Item order: file size, date added, date updated, name, countOpenings
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

context menu: reset countOpened, delete item, open in default application, open in browser, show in finder, edit item, untoggle tags, (group items, ungroup items)

## Other TODO
* Intro wizard
    * choose save location
    * copy or link files
    * fill with example data?
* Fix settings screen
* Import list: better overview
* List of keyboard shortcuts
* add link to preferences to menu bar
* automatically open import modal if no other items exist
* test deletion of items
* create and add icon for application

## Improvments
* compare hash of files to check if they are the same
* details top area: "home" button, back button
* Make URL clickable in right sidebar
* right sidebar - save on command + s
* toggle right sidebar on shift+cmd+b
* list of keyboard shortcuts
* main grid: select multiple items using the keyboard
* detailview bottom bar: support up and down arrows
* Quicksettings in top bar: show name, date changed, mute video preview
* ellipsis for text in long filenames in item preview
* url symbol for all previews
* item preview for additem modal: action queue for external file previews - always show the preview not the icon. Create new when app starts
* option in settings: rename files if item gets renamed
* if item groups work make a toggle to automatically group files if they are in a folder when importing


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

* right click on an item opens a context menu: edit item, show file in finder, open in default application, open in browser, delete item

* main top area: quick settings, order, home button, back button
* fix/limit settings view
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
