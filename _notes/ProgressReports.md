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
The last two weeks I have spend most of my time developing and have made good progress. I have:
* Added support for video files: the preview in the grid shows a thumbnail and on hover a videopreview of the video gets played. The detail view shows the video and allows the user to play it. Both views display a preview image if a user hovers over the seekbar which shows the frame at the currently hovered position in the video (comparable to YouTube).
* Added an "ImportProgressModal" which shows a list of all the files in the import queue and those which are currently getting imported (generating the preview of long videos can take some time)
* Users can now order the items by either file size, date added, date updated, name or countOpenings, either in ascending or descending order.
* Fixed some bugs, e.g., deletion of items in the DetailView, updating bookmark thumbs, and others.



Plan for the next two weeks:
* Fix a bug when changing the item previews - if the new preview file is called the same as the old preview file in some cases the old one is displayed because it is served from Electron's cache.
* Create context menus and accompanying modals
* Finish deletion confirm modal


## Report 3
The last two weeks I have:
* Fixed a bug regarding the preview images not updating correctly after a user has changed them (in some cases the old image was displayed because it was served from the cache)
* Implemented a modal to confirm the deletion of items
* Added a context menu to the main grid which allows users to open an item in the OS file explorer, delete the item or edit the item
* Added a context menu to the tags sidebar which allows users to rename or delete a tag, deselect all tags ("Show all items") and display items without any tags ("Show untagged")
* Added an icon and decided on a name for the application: "TagNest"
* Replaced Electron's default "About" window with a basic custom one, added a link to the settings screen (not yet implemented) to the menu bar
* Started with the functionality to add highlights to bookmarks


Plan for the next two weeks:
* Finish the functionality to add highlights to bookmarks
* Implement the functionality to add highlights/marks to videos
* Work through week 8 of the module's material and start planning the poster

## Report 4
The last two weeks, I have:
* Finished the functionality to add highlights to bookmarks
* Added the functionality to add highlights/marks to videos
* For bookmark highlights, their count, and for video highlights, their position in the seek bar, are displayed in the preview
* Started planning the poster 
* Increased the security of the application by adding a CSP, disabling nodeIntegration, etc., based on the security guidelines of Electron
* Fixed numerous bugs. The application is now at a stage where I can start to use it. This had the result that I have detected many many more bugs - I have added them to my list of bugs and will work on them in the next weeks and months.

Plan for the next two weeks:
* I will start creating the poster
* I will work on my huge list of bugs and issues, starting with the most important ones. Some of these bugs may require significant code refactoring, e.g., how I handle creating and updating items.


Report 5
* I spent multiple days struggling with CSS, mainly regarding the item previews. The main issue was problems with aspect ratio and wildly different sizes of items while trying to position the item's name and other information absolutely. I have deleted all the code I had previously used in the DetailView's bottom area preview, and now I reuse the same grid as in the MainGrid. After some changes, most of the problems have been fixed, but I still have some issues. Further, the current solution involves several additional divs and a wild mix of grid, flexbox, absolutely positioned elements, and static elements that are behind absolutely positioned ones. This is incredibly hard to reason about, and I will try to simplify it in the next weeks.