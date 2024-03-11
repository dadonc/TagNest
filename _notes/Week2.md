Great, thank you for your go ahead.
Here is my second weekly report: 

As my project, I have chosen my second idea, "A tagging-based application for the collection and visual display of digital files and web pages".

This is a development focused project so I will need to do a technical review. This includes looking at existing solutions, what technologies to use and a literature search.

I have consolidated most of my ideas regarding the project's envisioned functionality into a single document (added below). This document is relatively broad and open to change after a more in-depth research of similar applications, literature review and after getting feedback from talking to possible users.

# Applications with somewhat similar functionality
* https://www.pinterest.com/
* https://videohubapp.com/en/
* https://archivebox.io/
* https://raindrop.io/
* https://www.tagspaces.org
* tagbased bookmark managers: 
    https://bookmarkos.com/bookmark-manager-finder/Tags
    https://bmarks.net/felipecortez
    https://booky.io/
    https://getpocket.com/collections


# Research terms
* file management system/software
* (file) collection management (system)
* bookmarks (collection) (manager)
Maybe:
* personal knowledge base
* personal information management (system)

# Technology
Base functionality: Electron, Typescript, Svelte, TailwindCSS (+DaisyUI?), PrismaJS, Sqlite
For the different items: ffmpeg, pdfjs(?), chrome extension to download websites as mhtml files

This is based on personal preferences and experiences. I will explain the decisions in more detail in the technical review.

# Goals/Evaluation
Goals:
    - implementing the application as envisioned, i.e. implementing the functionality described in the document below
    - adhering to the (still WIP) design goals

Validation/Evaluation:
    - comparing the finished application to the (not yet finished) list of functionality it should have
    - my own experience using the application
    - observations of other users using the application
    - user interviews comparing their experience to the design goals

# Design goals
* simple to use but supports advanced users with keyboard shortcuts
    - interface must not be cluttered
    - most of the functionality should be accessible using keyboard shortcuts
    - users should be able to use the application without reading the documentation
* fast 
    - no action should result in a loading screen
    - items should be displayed as fast as possible. Either use pagination or virtual scrolling if many items are displayed
    - if possible, tasks should be run in the background, e.g. video preview generation
* somewhat customizable
    - follows its own ideas but users should be able to adjust how items are previewed, what information is displayed, etc.


# Overview of the envisioned application
**Working title**: Hobby Research Base  
**Short description**: A tagging-based application to keep track of files regarding my hobbies and to and collect digital files.  
**Elevator pitch**: Local Pinterest but supports all files(videos, pdfs, etc) and bookmarks are saved locally.  
**Long description**: 
The envisioned application helps users to collect digital files and filter them using tags.
The application displays imported files and bookmarks in a grid view, with the option to view each item in fullscreen. On double click, supported items are displayed in large inside the application. Other item types are opened in the default application.
The application supports different types of items (videos, images, audio files, pdfs, bookmarks, groups, other). Each item type has its own preview and associated information.
For example, videos should be displayed as a preview image and on hover a video preview should play. The video preview should be generated automatically. The user should be able to choose the frame that is used as the preview image.
The detail or large views also differe betweem item types. For example, if a user hovers over a video seekbar a preview of the frame at this position should be displayed. For bookmarks, the saved website should be displayed inside the application.
Bookmarks are saved locally using a Chrome extension, files are copied to a local folder. Items are organized using tags. Users can select or deselect one or more tags to filter the items displayed in the grid view. Items can be grouped together, e.g. several images of an album which are closely related and not all of them should be shown in the main view. 


# Functionality
## Screens
* Main view
* Detail view
* Settings view

## Modals
* Add item
* Confirm delete

## Main view
* displayed as a left and right sidebar, top and bottom bar and a middle area
* middle: grid with item previews
* left: the tags sidebar - select or deselect tags to filter the items displayed in the grid view, the sidebar can be closed
* right: the item details sidebar: information about the selected item(s) is displayed here, tags can be added or removed here, notes can be added here, the sidebar can be closed
* top: 
    - icons for: settings, add item (opens a modal to import one or more files)
    - status e.g. import progress

* bottom:
    - zoom level - how many items are displayed in one row of the grid
    - number of items after the current tag-filter was applied
    - pagination if no virtual scrolling is used

### Item previews
* videos: users can choose a single frame as preview, on hover a video preview is played, duration is displayed
* pdfs: preview of the first page
* images: the image itself is displayed
* bookmarks: screnshot of the website or single image from the website is displayed, choosable by the user, link to open in browser
* group: icon indicating it is a group,  number of items in the group, user can choose the main item to be used as preview
* other files: default icon or, if possible, a preview of the default icon/application on the user's system
* right click on an item opens a context menu: edit item, show file in finder, open in default application, open in browser, delete item

### Item type specific
* bookmarks are saved using a chrome extension, the extension saves the website as a mhtml file and the screenshot of the website
* video preview generation is done using ffmpeg


## Detail view
* can be opened by double clicking an item in the main view
* the selected item is shown in the middle area, left and right sidebar are hidden by default but can be opened
* if an item group is opened the items are displayed in a grid view similar to the main view
* bottom area: preview of next and previous items, can be closed
* top area: "home" button, back button

### Item specific detail view
* videos: video player with controls, preview of the video on hover(see youtube)
* pdfs: pdf viewer
* images: image 
* audio: audio player with controls
* bookmarks: saved website is opened inside the application, link to open in browser
* group: items are displayed in a grid, similar to the main view

## Settings view
* users can choose database and file location, should allow sync using a cloud service

# Ideas probably in scope
* User should be able to order items based on date added etc.
* User should be able to highlight specific timestamps of a video and add a note to it
* User should be able to highlight parts of a bookmark and add a note to it

# Ideas/probably out of scope
* User should be able to highlight parts of a pdf and add a note to it
* Import view
    * Shows the progress of the import
    * Can be opened if the user clicks on the import progress in the top bar
* filtering by file type and other file properties, e.g. video duration
* allow users to create their own item types, e.g. a type for books
* allow users to order the tags, should default to order based on tag count
* support video subtitles
* search functionality
* for audio files as item preview a preview of the waveform could be generated
* for bookmarks the application could check whether the website was updated and save several versions of the website.
* undo/redo functionality
* package application not only for macOS but also for Windows and Linux
* implement update functionality (server, migration, client, user notification)

# Glossary
item: one file or bookmark, there are different types of items: image, audio, video, bookmark, pdf, group, other  
item group: a group of items that are related to each other and should be displayed as a single item in the grid view

# TODO
* technical review
* SMART goals
* learn more about validation and evaluation