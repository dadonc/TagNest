TODO:
* gantt
* screenshot:
    - find appropriate bookmarks and files
    - annotate screenshot

* find sources
* Add bibliography


# Introduction and Background

This development project aims to create a macOS application that allows users to save bookmarks locally and to organize and view them - as well as other local files - using tags.
It uses a very visual approach, both because this can improve recall of the website in question compared to only a text-based approach(Nelson et al., 1976) and because, bookmarks tend to be used more if they are highly visible (Bergman et al., 2021)
User-generated highlights have been shown to decrease the time it takes for a user to find the desired information. (MacKay et. al., 2005, Kawase et al, 2010) Therefore, to make it easier to resurface specific information within a previously saved website, the application supports highlighting parts of a bookmark. 
Due to the large amount of information in videos (XXXX), the application also supports modern features of webbased video players like videopreviews on hover over a video, frame previews on hover over the seekbar, as well as the ability to highlight specific parts of a video. This enables users to quickly find the information they are looking for in a video. (Tiernan & Farren, 2017)

## Functionolaity
* Support for different item types: bookmarks, video, PDF, audio, text, and external
* Support choosable preview images for bookmarks and videos
* On double-click, open the item in large
* Multiple items can be edited at once
* Dark mode

## Code
Electron works by having a "main" and a "renderer" process. The renderer process is is responsible for the UI and has only limited access to the file system, i.e. cannot access the database directly. Communication between the two processes is done via IPC. This involves a lot of boilerplate and each function has to be explicitly exposed to the renderer process.
I have reduced this overhead by writing a generalized database function that sends function calls as strings which are parsed in in the main process.

Using a combination of JavaScript's Proxy and TypeScript's type system, this creates a type-safe interface to the database that works as if accessing the database directly.


## Technologies
The application is written using web technologies, specifically TypeScript, Svelte, and TailwindCSS. The database is SQLite accessed using the Prisma ORM, and the application is packaged using ElectronJS.
Websites are sent to the backend using a Chrome extension:

Saving a bookmark
Chrome extension -> Fastify server -> Prisma ORM -> SQLite database

The chrome extension saves the open website as a MHTML file and a screenshot, which are then sent to a server running in Electron's main process. The server saves the files and creates a bookmark in the database.

Displaying a bookmark
Svelte frontend -> Electron main process -> Prisma ORM -> SQLite database -> Svelte frontend

The frontend requests the bookmarks from the main process, which then fetches them from the database and sends them back to the frontend.

## Progress
The application is now at a stage that I can start using it for my own bookmarks. The main functionality is implemented, but many edge-cases are not yet handled, there are several critical bugs, and some features are still missing. 



# Bibliography

Bergman, O., Whittaker, S., & Schooler, J. (2021). Out of sight and out of mind: Bookmarks are created but not used. Journal of Librarianship and Information Science, 53(2), 338–348. https://doi.org/10.1177/0961000620949652 

Kawase, R., Papadakis, G., Herder, E., & Nejdl, W. (2010). The impact of bookmarks and annotations on refinding information. Proceedings of the 21st ACM Conference on Hypertext and Hypermedia, 29–34. https://doi.org/10.1145/1810617.1810624

MacKay, B., Kellar, M., & Watters, C. (2005). An evaluation of landmarks for re-finding information on the web. CHI ’05 Extended Abstracts on Human Factors in Computing Systems, 1609–1612. https://doi.org/10.1145/1056808.1056978 

Nelson, D.L., Reed, V.S. and Walling, J.R. (1976) ‘Pictorial superiority effect.’, Journal of Experimental Psychology: Human Learning and Memory, 2(5), pp. 523–528. doi:10.1037/0278-7393.2.5.523. 

Tiernan, P. and Farren, M. (2017) ‘Digital Literacy and online video: Undergraduate students’ use of online video for coursework’, Education and Information Technologies, 22(6), pp. 3167–3185. doi:10.1007/s10639-017-9575-4. 

Nest icon created by Freepik - Flaticon https://www.flaticon.com/free-icon/nest_427432