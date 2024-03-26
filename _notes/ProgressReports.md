# Weekly Progress Reports
The last two weeks I have 
* fixed a problem with my usage of electron-forge which didn't allow me to package the application. This now works again.
* added support for audio files - both the preview as well as the detail view are now able to play audio files and show their duration.
* added support for text files - the first 100 chars are displayed in the preview, the detail view allows users to read and edit the whole file.
* struggled (way too long) with CSS and layout issues. I believe I now have found a good solution and have a better understanding of the problem

Plan for the next two weeks:
* work on the item type "video"
* work on some of the many issues in my bugs and issues list. E.g, deletion of items in the DetailView doesn't work.


## Report 2
The last two weeks I have
* Added support for video files: the preview in the grid shows a thumbnail and on hover a videopreview of the video gets played. The detail view shows the video and allows the user to play it. Both views display a preview image if a user hovers over the seekbar which shows the frame at the currently hovered position in the video (comparable to YouTube).
* Added an "ImportProgressModal" which shows a list of all the files in the import queue and those which are currently getting imported (generating the preview of long videos can take some time)
* Users can now order the items by either file size, date added, date updated, name or countOpenings, either in ascending or descending order.
* Fixed some bugs, e.g., deletion of items in the DetailView, space preview, and others.



* Replaced Electron's default "About" window, added a link to the settings screen (not yet implemented) in the menu bar
