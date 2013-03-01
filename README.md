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
	 x import a real corpus (my recipes?)
	 	x find markdown->html clientside renderer (coauthor code?)
	 	x get bootstrap.js to read from fs to import recipes into wiki

	 - get bookmark's contents in the mix
	  - addon to look at history, extract recent urls
	  - post handler node.js -> mongo
	 	- get bookmark queue in mongo
	 	- spider bookmarks in most recent first order
	 	- use justext to extract content, store that in sqlite & mongo
	 		- figure out which subprocess node module to use to outsource jobs to python/justext.
	 - think about search interactions, curating search results

	 - mock up social search & central search

- consider looking for a large github hosted markdown content repo for scale testing

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
