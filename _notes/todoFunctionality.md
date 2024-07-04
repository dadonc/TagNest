# TODO
scroll to item on arrowback if opened in detailview
hover over videobar results ins many network requests 

import single item fix
make function that extracts paths from subfolders faster

checkbox whether file should be deleted if file isnt copied into db folder
preview files arent deleted (what about if import is canceled)
firstimportstep: copy item into temp folder, delete after import or cancel. Sometimes the item gets deleted if a bug arises

does item rename break anything? Scroll to item after rename

why do I need type ImportItem?

add name to audiopreview
Recreate video preview is broken 

* resolution filter

dont call saveVideoDetailsToItem twice

* autoplay video if it is opened from the mainview, also when clicked inside the seekbar in bottompreview
* allow changing item in detailview using the arrows if bottomarea is closed
* jump to start of videomark on mark click
* after pausing the play icon isn't centered
* display small videos (240p) in large in detailview
* continue import of the currently next item in the importlist if the current one is canceled in the import modal
* scroll to item after rename
* delete files if import is cancelled
* if a video was played and has finished arrow left should jump back in the same video, not to the previous item


* break words in importmodal
* dont center item names in delete modal

* deleteque is broken when deleting mutliple - check for all item types


## Bugs
* handle duplicate bookmarks: make screenshot file names unique
* modal sizes
* colors video: bg hover time (light), bg progressbar (dark)
* tag group styling - change inset of children compared to parent tag
* change input styling for right sidebar
* bookmark space preview: 
    close on ESC after clicking inside rendered bookmark
* Possibly: When displaying all untagged items, update the list of deselected tags if a new tag gets added, thereby hiding the item for which a new tag was created(?)
* fix import queue for concurrent imports
bottomarea grid - scroll to item if arrow left or arrow up is used

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
    o	✅ User highlights: ✅ video timestamps, ✅ highlights in bookmarks, ✅ preview in left sidebar, ✅ indicator in grid preview
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
    * number of concurrent import tasks
* automatically open import modal if no other items exist

## Improvments
* Simple searchbar
* "Tabs"
* convert .flv to mp4
* Open in new window/duplicate app window
* make videopreview on seekbar hover adjustable in the settings
* Quicksettings in top bar: show name, show type, show count highlights, date changed, mute video preview, countOpened, show tags in previews, show file size
* item preview: show tags(clickable, toggle on off in quick settings) - also show in detailview
* Make URL clickable in right sidebar, add url icon to item preview
* Make paths relative!
* Add "searchbar" for tag quick selection 
* add notes or tags to videomarks, add notes to bookmarkhighlight
* details top area: "home" button, back button
* item preview for additem modal - start with creating a separate AddItem component

* settings toggle: rename files if item gets renamed
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
* DetailView BottomArea: display as list
* audio marks
* PDF highlights
* Create a text file if user adds an item without file, remove itemtype "noFile"
* recreatevideopreview: save start position of preview in db and show in the modal what was the last position
* custom MainList
* save importqueue with the databasepath, i.e. switching database doesn't lose the import queue


## Testing
Test all item typestype 

ItemType =
  | "bookmark"
  | "image"
  | "video"
  | "pdf"
  | "external"
  | "noFile"
  | "audio"
  | "text";

* in grid view, in detail view, in space preview, in right sidebar

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
* auto tag using AI