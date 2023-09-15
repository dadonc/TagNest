# Bugs

* importing an item crashes the app :O
* selecting a tag and then removing it from an item doesn't remove the tag from selectedTags
* creating items without a file hangs the importQueue
* change the required inputs for creating items
* item urls link to localhost   

current items aren't displayed while importing new items  
preview image not diplayed after import - only after reload  

delete files on item delete  
How to work with item that are imported twice? (e.g. same file, different name)

scroll to current position after closing detail view
increase import speed  
display video details somewhere  

icons: tagfamily, import indicator

improve video preview image selection
deletion confimration dialog

set correct created.at for files
(reversable) order of items: name, date created/modified, type, size, tags
save.json somehow gets corrupted after migration

item sort: viewcount, last opened, created, 

secondary fake fullscreen - force full video width
don't save full path in database, only relative path
what is item.file for bookmarks?
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
tag groups (e.g. "bees"), change tag group order

save bookmark previews as files instead of in database


* iframe - rmv webfonts
* bottom area preview - allow arrow up/down to navigate - https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects

* buttons pulsate if another button is clicked

* delete files on item delete
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
