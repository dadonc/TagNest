# Bugs



* don't open bottom bar on zoomLevel click
* rightArea limit preview image size

* iframe - rmv webfonts
* bottom area preview - allow arrow up/down to navigate - https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects


* buttons pulsate if another button is clicked

* deselect count, ie minus in left side next to tags
* delete files on item delete
* delete files saved from url when clicking cancel
* delete newly added bookmark if canceled before saving


## Refactor
* remove promise around itemStore
* alsways create new items in database when adding items - updateOrCreate should only be update => should it?

## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it
