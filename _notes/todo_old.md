# Bugs

increase import speed
preview image not diplayed after import - only after reload
delete files on item delete
display video details somewhere

current items aren't displayed while importing new items
add tag to video without changing preview image, fix preview image selection



hide play symbol until video is loaded
currViewStore: rmv route

delete files on item delete
How to work with item that are imported twice? (e.g. same file, different name)

* choose video preview on click 
* set correct created.at for files
* save.json somehow gets corrupted after migration

Styling:
secondary fake fullscreen - force full video width
don't save full path in database, only relative path
what is item.file for bookmarks?
rmv latestMigration from save.json
show video details somewhere
allow creation of new window with same database

rigth side - show items if multiple items are selected
## Video
detailview preview on space keydown
import folders with subfolders
DetailviewVideo: autoplay videos on click, don't on arrows 



"untagged" tag
type filter - display only items of selected type

make obvious that import is running on importMultiple page (spinner) on click on "import all" don't change items that are already getting imported, deactivate button if all are already getting imported?
"external" items and pdfs overflow on the x axis
* rightArea limit preview image size

(item groups, pin tags/items)
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
## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it



/Users/domenic/Projects/eTags/node_modules/electron/dist/Electron.app/Contents/Resources
