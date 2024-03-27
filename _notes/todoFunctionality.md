# TODO


* detailpreview: 
    scroll selected item into view on opening

* deleteModal:
    delete on enter, show item preview if single is selected

## Bugs
* right sidebar 
    - decrease preview size
    - preview external files and pdfs
* colors video: bg hover time (light), bg progressbar (dark)
* tag group styling - change inset of children compared to parent tag


### Not important bugs
* tag input bug, "Tags" background hint text
* close pdf on ESC; pdfjs is broken on space preview
* main grid scrollbar is inside the rightmost items



## Revised plan
•	Developing the application (01.06.24)
    o	✅ Cleanup and refactor codebase, fix some bugs
    o	✅ Support different item types: video, PDF, audio, text and other
    o	✅ Support choosable preview images for bookmarks and videos
    o	(Re)write chrome extension
    o	Context menu, ✅ deletion modal
    o	User highlights: video timestamps, highlights in bookmarks, preview in left sidebar, indicator in grid preview
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

### context menu 
context menu main: reset countOpened, delete item, open in default application, open in browser, show in finder, edit item, (group items, ungroup items)
context menu detailview: same as main
context menu tags: untoggle tags

## Other TODO
* Intro wizard
    * choose save location
    * copy, move or link files
    * fill with example data?
* Fix settings screen
* List of keyboard shortcuts
    * right sidebar - save on command + s
    * toggle right sidebar on shift+cmd+b
    * shuffle items on cmd+shift+s
* automatically open import modal if no other items exist
* main grid: scroll into view when using arrow keys


## Improvments
* details top area: "home" button, back button
* item preview for additem modal
* main grid: select multiple items using the keyboard
* Quicksettings in top bar: show name, date changed, mute video preview, countOpened, show tags in previews, show file size
* item preview: show tags(clickable, toggle on off in quick settings) - also show in detailview
* Make URL clickable in right sidebar
* url symbol for all previews with a link
* action queue for recreating video previews
* option in settings: rename files if item gets renamed
* loading indicator when opening external files
* ellipsis for text in long filenames in item preview
* detailview bottom bar: support up and down arrows
* Make paths relative


## Not important
* compare hash of files to check if they are the same
* electron security warnings
* update deps


## Probably out of scope:
* update functionality
* Search
* autogenerate type tags
* undo/redo  
* custom tag order
* transcode videos to a supported format ( e.g. :"m4v","mov","avi" into "mp4" or "webm" )
* item groups
    * group: icon indicating it is a group,  number of items in the group, user can choose the main item to be used as preview
    * if item groups work make a toggle to automatically group files if they are in a folder when importing

LIMITATIONS:

Ublock doesn't run, not completely everything is saved, e.g. fonts, embedded audio and video
Possibly problems with the highlights due to mhtml
No way to access the stuff using a mobile device
