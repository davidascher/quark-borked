quark
=====

Build notes:
 - needs jquery-ui that matches jquery or para reordering won't work.

Microfeatures
 x renamed pages register redirects serverside [this feel great as a user]
 x click away from textbox should escape / save it
 x persist reorderings through index tweakings

Todos:

 - focus on search
	 - import a real corpus (my recipes?)
	 	- find markdown->html clientside renderer (coauthor code?)
	 	- get bootstrap.js to read from fs to import recipes into wiki

	 - get bookmark's contents in the mix
	 	- get bookmark queue in mongo
	 	- spider bookmarks in most recent first order
	 	- use readability service to extract content, store that in mongo
	 - think about search interactions, curating search results

	 - mock up social search & central search

  - make personal:
	  - when not logged in, can't edit?
	  - or make not-logged-in-edits suggestions for curation?
	 	
	- make alive
	 - new -> json, code blobs
	 - realtime content - how should it be indicated?

 - think about urls, routing, etc.
 - figure out how to indent para while keeping paragraph reordering reliably smooth.
 - think about UX for new para and new page link
 - redirects get scanned periodically to fix links from internal pages
 - show redirects?
 - (someday: redirects get broadcast to peers)

Think about cards - current card, searched cards, past cards?
