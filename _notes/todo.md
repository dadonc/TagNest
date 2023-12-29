fix fullscreen

rename file if the same name already exists but the sizes differ
save filesizes to db
handle existing bookmark

AddModal single video: top is cut off, save button is too low, video has focus and closing the modal on ESC doesn't work

back button should jump to last detail view, separate home button
vertical video preview images and previews are too high
addBookmark modal is broken

space preview
  - show video preview whan opening 
  - center vertically
  - add white background (see bookmark of chatgpt page)

display import progress somewhere other than the console.
Clear import status right top corner after import is finished

If a file is in the importqueue the app is closed, the file gets deleted, the app is restarted, the 
app crashes because the file is not found.

rewrite preview image creation, (save button is disabled if the image gets changed)

performance problems while import is running:
 - video preview should start instantly
 - video preview image takes too lang to load if one scrolls fast
 - update video timeline thumbs don't update pften enough



recreate video preview with changed settings
  - ui, set start delay
  - if new position was marked, recreate video preview inlcuding the new position

toggle rightbar on command+i


# Bugs when showing Jessi
* cancel creation of items - is everything deleted? especially bookmarks?
* Don't break the app if the database folder is deleted
* fold in members of tag group is broken -> cannot click on caret
* tag spacing is off
* dark mode grid view url link on bookmark hover
* addmodal disappears if a video preview is chosen
* import view is fucking broken
* import problem of video file - see untitled folder
  * ImportQueue.ts:159 Uncaught (in promise) Error: Error invoking remote method 'createVideoPreview': reply was never sent
* check for duplicates

* what happens if the app is quit or reloaded and only the first import step has run?

reload queue after deleting an item - hanged after i deleted an item that didn't work 

# Bugs
* tag select sometimes (?) looses border radius after tag was selected(?)
* space triggered detailview video 
  - change color of seek bar
  - fullscreen is broken
    - not full
    - doesn't exit cleanly 
  - wrap around on last/first item
* tagTree spacing is off
* preview image not displayed after import - only after reload, both bookmarks and import multiple
  - if multiple items are imported, the previewImage of the last one isn't displayed
  - detailview?
* window location buttons (red, yellow, green) - move down and left a bit
* grid wrap around on arrow last item, first item
* importqueue  
  - starts on reload even if import was not started
  - importing one item imports them all
  - import indicator is displayed even if no import is running
* Error occurred in handler for 'deleteFile': Error: ENOENT: no such file or directory, unlink '/Users/domenic/Downloads/t4/Stadtbienen   Auftakt Imkerkurs 2022   Teil 1 (720p_30fps_H264-192kbit_AAC).mp4'
* Save mhtml after ublock is finished?! Exactly like it is seen by the user
* bookmark detail view: display image until mhtml is loaded?
* detailview bottom preview images size changes after selecting the next item 
* allow paths to hidden folders
* import queue is shared between different databases


# TODO
* highlight handle to change left and right bar sizes - see spotify
* toggle to display tag on PreviewItems in gridview, exclude already selected/filtered for tags
* add "open in finder" to context menu
* improve settings screen with explanations, increase topbar height
* make numer of simultaneous imports configurable
* videos save last position if switching videos in detailview?
* handle already existing files
    - handle single import
    - handle multiple imports
    - display on import page
    - handle already existing bookmarks
* make item paths relative to database path
* choose video preview image on click
* fix import view
  - checkbox with "Update view as soon as an item becomes available"?
  - import folders with subfolders
  - don't change items that are already getting imported, deactivate button if all are already getting imported?
  - disable already existing items
* deletion confirmation dialog
* DetailviewVideo: autoplay videos on click, don't on arrows 
* "external" items and pdfs overflow on the x axis
* rightArea limit preview image size
* delete newly added bookmark files if canceled before saving
* right side - show items if multiple items are selected
* secondary fake fullscreen - force full video width
* detailview - arrow down to select next item


## TODO secondary
* pdf preview when creating an item?
* "❤️ Favorite" - Tag, icon - always displayed at the top
  * downranked, upranked buttons
* item order
    - (reversable) order of items: name, date created/modified, type, size, tags, viewcount, last opened
    - set correct created.at for files
    - increase viewcount on detail view
    - type filter - display only items of selected type
* drag to select multiple items
* increase import speed  
* display video details somewhere  
* Right click on item - "Show in Finder"
* allow creation of new window with same database
* "untagged" tag
* bottom area preview - allow arrow up/down to navigate - https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects
* rename files on item rename pref toggle
* undo deletion
* update server and ui
  - fix schema updates, does save.json get corrputed? 
* tag specific times on videos
* right sidebar as a modal if clicking command + i
* move db isnt implemented

## TODO tertiary
* Searchbar, including tag toggle
* change tag group order
* "Pin" items - always appear at top if a tag is selected and the items are inside the collection?
* item groups, pin tags/items
* Notion-like notes
* adblocker for mhtml
* highlight things inside mhtml and pdf files
* trash bin

## Styling
* font sizes
* white play icon with black border
* hide play symbol until video is loaded

## Refactor/Improvements
* only include db fields that are used in the interface. E.g. in getItem all the video information is not necessary
* Should getVideoResolutionDescription() be saved in the db or calculated on the fly?
* creater a model "Type" isnide the schema linking to video/bookmark etc
* remove daisyui
* remove promise around itemStore
* refactor CreateOrEdit
  - possibly: alsways create new items in database when adding items - updateOrCreate should only be update => should it?
* currViewStore: rmv route
* rmv .env?
* rename "src" folder to "electron"?
* tests: https://github.com/spaceagetv/electron-playwright-helpers
* electron security warnings
* bump deps
* rmv latestMigration from save.json
* iframe - rmv webfonts
* video deflicker step takes long - make secondary import queue?
* detailview bottom: remove var(--bottomAreaPadding), change paddings

## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it

## Ideas
* "Collections" !!! - only display items and tags that are inside the collection - grid with different collections as main screen e.g. "books", "boardgames", "movies", "music"
  - local and private pinterest
* Custom types for collectors, e.g. books, boardgames
* Open in VSC: https://stackoverflow.com/a/68881419
* Mobile application? Full rewrite
* create subtitles for videos and make searchable
* export files ordered like the user wants them, e.g. tags for folders