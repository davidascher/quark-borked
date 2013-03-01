quark
=====

Build notes:
 - needs jquery-ui that matches jquery or para reordering won't work.

Microfeatures
 x renamed pages register redirects serverside [this feel great as a user]
 x click away from textbox should escape / save it
 x persist reorderings through index tweakings
 x import a real corpus (my recipes?)
 x find markdown->html clientside renderer (coauthor code?)
 x get bootstrap.js to read from fs to import recipes into wiki
 x addon to look at history, extract recent urls
 x post handler node.js -> mongo
 x use justext to extract content, store that in sqlite & mongo
 x figure out which subprocess node module to use to outsource jobs to python/justext.

Todos:

- friday: focus on UX
  - Pages should have a type: page, link, image, json, code?
  - fix columnar layout
  - think about scrolling
  - search endpoint returns page IDs
  - going from search results to curated list
    - curating search results -- just throw away irrelevant cards?
    - drag from search panes onto current pane.
    - make a curated search a first-class page (live, or frozen?)
    - merge links with paragraphs?

 - focus on search

	 - get bookmark's contents in the mix
	 	- get bookmark queue in mongo
	 	- spider bookmarks in most recent first order
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
 
Technical debt:
	- redirects get scanned periodically to fix links from internal pages
	- (someday: redirects get broadcast to peers)
	- is it possible to do the urlgather code inside of meteor? (single process would be better!)

Open questions
	- show redirects?
	- tagging: simple or faceted?
	- include tweets, or just tweeted links?  if tweets, only mine and the ones i reply to?  replies to me?

Think about cards - current card, searched cards, past cards?
think harder about federation - maybe setup micro server farm process per topic?
