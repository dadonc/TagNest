# Bugs
* detailview - bottom preview of other items change size when selecting using the keyboard
* space triggered detailview video 
  - change color of seek bar
  - orange border around window
  - fullscreen is broken
    - not full
    - doesn't exit cleanly 
* tagTree spacing is off
* preview image not displayed after import - only after reload, both bookmarks and import multiple
* window location buttons (red, yellow, green) - move down and left a bit
* grid wrap around on arrow last item, first item


# TODO
* handle already existing files
    - handle single import
    - handle multiple imports
    - display on import page
    - handle already existing bookmarks
* make item paths relative to database path
* scroll to item after closing detailview
* choose video preview image on click
* fix import view
  - import folders with subfolders
  - don't change items that are already getting imported, deactivate button if all are already getting imported?
  - disable already existing items
* import indicator
* deletion confirmation dialog
* DetailviewVideo: autoplay videos on click, don't on arrows 
* "external" items and pdfs overflow on the x axis
* rightArea limit preview image size
* delete newly added bookmark files if canceled before saving
* right side - show items if multiple items are selected
* secondary fake fullscreen - force full video width


## TODO secondary
* pdf preview when creating an item?
* "❤️ Favorite" - Tag
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


## TODO tertiary
* change tag group order
* "Pin" items - always appear at top if a tag is selected and the items are inside the collection?
* item groups, pin tags/items
* Notion-like notes


## Styling
* font sizes
* white play icon with black border
* hide play symbol until video is loaded

## Refactor/Improvements
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

## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it

## Ideas
* Custom types for collectors, e.g. books, boardgames
* Open in VSC: https://stackoverflow.com/a/68881419

