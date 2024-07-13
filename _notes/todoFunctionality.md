# TODO

verify delete if import is cancelled
    * news.ycombinator favicon isn't deleted
    * video preview isn't deleted


deselect items on click anywhere

bug: importing the same bookmark twice and deleting one of them

* break words in importmodal

tag placeholder overflows if right sidebar is too narrow



import whole folder and its subfolders seems broken?
    make function that extracts paths from subfolders faster

does item rename break anything? Scroll to item after rename


add name to audiopreview



* autoplay video if it is opened from the mainview, also when clicked inside the seekbar in bottompreview
* allow changing item in detailview using the arrows if bottomarea is closed
* display small videos (240p) in large in detailview
* continue import of the currently next item in the importlist if the current one is canceled in the import modal
* if a video was played and has finished arrow left should jump back in the same video, not to the previous item





## Bugs
* AddBookMarkModal doesn't appear if the Settings screen is opened when the chrome extenison is clicked
    * switch to grid (from eg settings) if bookmark import is started
* handle duplicate bookmarks: make screenshot file names unique
* colors video: bg hover time (light), bg progressbar (dark)
* change input styling for right sidebar
* bookmark space preview: 
    close on ESC after clicking inside rendered bookmark
* Possibly: When displaying all untagged items, update the list of deselected tags if a new tag gets added, thereby hiding the item for which a new tag was created(?)
* fix import queue for concurrent imports
dont call saveVideoDetailsToItem twice


### Not so important bugs
* tag input bug
* close pdf on ESC; pdfjs is broken on space preview
* main grid scrollbar is inside the rightmost items

* chooseBookmarkThumb: 
    disable save button
    show border around selected image - doesn't work for extracted images because the base64 cannot be compared to the file

## Refactor
rename videoPreviewImage to videoThumbImage
Make all modals ActionModals
ResetConfirmModal has superfluos <Modal>
* create separate component for CreateItem
* why do I need type ImportItem?



## Improvments
* "Tabs"
* resolution filter
* convert .flv to mp4
* Intro wizard: fill with example data?
* settings screen: number of concurrent import tasks
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
Test all item types

ItemType =
  | "bookmark"
  | "image"
  | "video"
  | "pdf"
  | "external"
  | "noFile" // remove?
  | "audio"
  | "text";

* in grid view, in detail view, in space preview, in right sidebar

## Not important
* compare hash of files to check if they are the same
* update deps


## Probably out of scope:
* element zapper for bookmarks to remove cookie banners etc
* update functionality
* Search
* undo/redo  
* custom tag order
* suggested tags based on existing tags, filenames and bookmark content, auto tag using AI
* transcode videos to a supported format ( e.g. :"m4v","mov","avi" into "mp4" or "webm" )
* item groups
    * group: icon indicating it is a group,  number of items in the group, user can choose the main item to be used as preview
    * if item groups work make a toggle to automatically group files if they are in a folder when importing
    * context menu main: (group items, ungroup items)
* magnifier, playback speed, searchable and highlightable subtitles



more research:
https://www.sciencedirect.com/science/article/pii/S1071581901904598
https://www.eelcoherder.com/images/publications/2010/the_impact_of_bookmarks_and_annotations.pdf