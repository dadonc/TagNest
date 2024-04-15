# TODO

* handle duplicate bookmarks: make screenshot file names unique
* highlights: Left sidebar: styling - use daisyui colors
* show count of bookmark highlights in preview
* show bookmark title in preview

Recreate preview is broken 

## Bugs
* jump to position in video from bottomarea in detail view
* modal sizes
* colors video: bg hover time (light), bg progressbar (dark)
* tag group styling - change inset of children compared to parent tag

* bookmark space preview: 
    close on ESC after clicking inside rendered bookmark

When displaying all untagged items, update the list of deselected tags if a new tag gets added, thereby hiding the item for which a new tag was created(?)

### Not so important bugs
* tag input bug, "Tags" background hint text
* close pdf on ESC; pdfjs is broken on space preview
* main grid scrollbar is inside the rightmost items

* chooseBookmarkThumb: 
    disable save button
    show border around selected image - doesn't work for extracted images because the base64 cannot be compared to the file

## Refactor
rename videoPreviewImage to videoThumbImage
ResetConfirmModal has superfluos <Modal>
DeleteConfirmModal is an ActionModal
* create separate component for CreateItem
    - save on command + s?

## Revised plan
•	Developing the application (01.06.24)
    o	✅ Cleanup and refactor codebase, fix some bugs
    o	✅ Support different item types: video, PDF, audio, text and other
    o	✅ Support choosable preview images for bookmarks and videos
    o	✅ (Re)write chrome extension
    o	✅ Context menu, ✅ deletion modal
    o	User highlights: video timestamps, ✅ highlights in bookmarks, preview in left sidebar, indicator in grid preview
    o	✅ Item order: file size, date added, date updated, name, countOpenings
•	Polishing the application (01.07.24)
    o	Fixes and improvements
    o	Improve styling
    o	Handle existing files and bookmarks(!) (duplicates)
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


## Other TODO
* Intro wizard
    * choose save location
    * copy, move or link files
    * fill with example data?
* Fix settings screen
    * List of keyboard shortcuts
* automatically open import modal if no other items exist

## Improvments
* details top area: "home" button, back button
* item preview for additem modal
* Quicksettings in top bar: show name, show type, show count highlights, date changed, mute video preview, countOpened, show tags in previews, show file size
* item preview: show tags(clickable, toggle on off in quick settings) - also show in detailview
* Make URL clickable in right sidebar, add url icon to item preview
* Make paths relative
* Add "searchbar" for tag quick selection 

* loading indicator when opening external files
* detailview bottom bar: support up and down arrows
* main grid: select multiple items using the keyboard
* url symbol for all previews with a link
* action queue for recreating video previews
* option in settings: rename files if item gets renamed
* ellipsis for text in long filenames in item preview
* autogenerate type tags, eg. "type:video", "type:pdf", "type:audio"
* bookmarkhighlights: support different colors, add notes to highlights
* filter: item type, video length, video resolution, audio length, pdf pages, text length
* "favorite" tag: heart icon on the item previews
* search inside bookmark iframe
* Left sidebar: Highlights: context menu: delete

## Not important
* compare hash of files to check if they are the same
* electron security warnings
* update deps


## Probably out of scope:
* element zapper for bookmarks to remove cookie banners etc
* update functionality
* Search
* undo/redo  
* custom tag order
* suggested tags based on existing tags, filenames and bookmark content
* transcode videos to a supported format ( e.g. :"m4v","mov","avi" into "mp4" or "webm" )
* item groups
    * group: icon indicating it is a group,  number of items in the group, user can choose the main item to be used as preview
    * if item groups work make a toggle to automatically group files if they are in a folder when importing
    * context menu main: (group items, ungroup items)
* (group tags, ungroup tags)?
* magnifier, playback speed, searchable and highlightable subtitles