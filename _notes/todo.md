# Bugs


make obvious that import is running on importMultiple page (spinner) on click on "import all" don't change items that are already getting imported, deactivate button if all are already getting imported?
"external" items and pdfs overflow on the x axis
* rightArea limit preview image size

* iframe - rmv webfonts
* bottom area preview - allow arrow up/down to navigate - https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects

* buttons pulsate if another button is clicked

* delete files on item delete
* delete files saved from url when clicking cancel
* delete newly added bookmark if canceled before saving


## Refactor
* remove promise around itemStore
* alsways create new items in database when adding items - updateOrCreate should only be update => should it?

## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it



/Users/domenic/Projects/eTags/node_modules/electron/dist/Electron.app/Contents/Resources
