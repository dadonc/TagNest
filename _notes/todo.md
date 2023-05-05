# Bugs
* don't open bottom bar on zoomLevel click
* delete newly added bookmark before saving
* buttons pulsate if another button is clicked

* deselect count
* delete files on item delete
* delete files saved from url when clicking cancel


## Refactor
* remove promise around itemStore
* alsways create new items in database when adding items - updateOrCreate should only be update

## TagSelect
* after adding all tags and clicking backspace it jumps to the beginning of the line
* cannot click in middle of tag to modify it
