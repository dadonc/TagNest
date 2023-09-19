# Bugs

deletequeue
    fix bookmarks, what is item.file for bookmarks?
    delete bookmark files

* are item types updated when the file gets changed? <- disallow this
handle already existing files


preview image not diplayed after import - only after reload  

scroll to item after closing detailview
make item paths relative to database path
handle already existing bookmark

* detailview - video is cut off
* detailview preview of other items change size when selecting using the keyboard
* space triggered detailview video - is cut off, change color of seek bar
* tagTree spacing is off
* choose video preview image on click
* AddItem: max preview dimensions
* white play icon with black border


pdf preview when creating an item?
"❤️ Favorite" - Tag

filter and order
drag to select multiple items


how is the temp filder next to db file used?
increase import speed  
display video details somewhere  

electron security warnings
bump deps

icons: import indicator
Right click on item - "Show in Finder"

improve video preview image selection
deletion confirmation dialog

set correct created.at for files
(reversable) order of items: name, date created/modified, type, size, tags

item sort: viewcount, last opened, created, 

secondary fake fullscreen - force full video width
rmv latestMigration from save.json
allow creation of new window with same database

rigth side - show items if multiple items are selected

hide play symbol until video is loaded
import folders with subfolders
DetailviewVideo: autoplay videos on click, don't on arrows 

"untagged" tag
type filter - display only items of selected type

make obvious that import is running on importMultiple page (spinner) on click on "import all" don't change items that are already getting imported, deactivate button if all are already getting imported?
"external" items and pdfs overflow on the x axis
* rightArea limit preview image size

item groups, pin tags/items
change tag group order

save bookmark previews as files instead of in database


* iframe - rmv webfonts
* bottom area preview - allow arrow up/down to navigate - https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects

* buttons pulsate if another button is clicked

* delete files saved from url when clicking cancel
* delete newly added bookmark if canceled before saving

* rename files on item rename?

## Refactor
* remove promise around itemStore
* alsways create new items in database when adding items - updateOrCreate should only be update => should it?
* support filenames with multiple dots ie. "file.name.jpg"
* currViewStore: rmv route
* rmv .env?
* rename "src" folder to "electron"?

## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it



/Users/domenic/Projects/eTags/node_modules/electron/dist/Electron.app/Contents/Resources


## Ideas
Custom types for collectors, e.g. books, boardgames