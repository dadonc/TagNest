# TODO/Timeline

* fix detailviewpreview bottom preview for external files
* loading indicator when opening external files
#
## Bugs
* hovering over PDF preview changes layout
* right sidebar 
    - decrease preview size
    - preview external files and pdfs
    

* colors video: bg hover time (light), bg progressbar (dark)

* tag group styling - change inset of children compared to parent tag
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
    o	✅ Item order: file size, date added, date updated, name, countOpenings
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
    * copy, move or link files
    * fill with example data?
* Fix settings screen
* List of keyboard shortcuts
    * right sidebar - save on command + s
    * toggle right sidebar on shift+cmd+b
* automatically open import modal if no other items exist

## Improvments
* Make URL clickable in right sidebar
* compare hash of files to check if they are the same
* details top area: "home" button, back button
* list of keyboard shortcuts
* main grid: select multiple items using the keyboard
* detailview bottom bar: support up and down arrows
* Quicksettings in top bar: show name, date changed, mute video preview
* ellipsis for text in long filenames in item preview
* url symbol for all previews
* item preview for additem modal: action queue for external file previews - always show the preview not the icon. Create new when app starts
* action queue for recreating video previews
* option in settings: rename files if item gets renamed
* if item groups work make a toggle to automatically group files if they are in a folder when importing
* item groups
* electron security warnings
* update deps





Probably out of scope:
* Search
* autogenerate type tags
* undo/redo
* item groups
* update functionality
* tag order

* transcode videos to a supported format ( e.g. :"m4v","mov","avi" into "mp4" or "webm" )
* item groups
    * group: icon indicating it is a group,  number of items in the group, user can choose the main item to be used as preview



* main top area: quick settings, order, home button, back button
* fix/limit settings view
* Handle already existing files
* Make paths relative
* Chrome extension


LIMITATIONS:

Ublock doesn't run, not completely everything is saved, e.g. fonts, embedded audio and video
Possibly problems with the highlights due to mhtml
No way to access the stuff using a mobile device
