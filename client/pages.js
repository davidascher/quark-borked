// TODOs

// new UI for creating new pages: asks for a name; editing names -> makes 302s and tweaks backlinks.
// make some pages starrable


Pages = new Meteor.Collection("pages");
Paras = new Meteor.Collection("paras");
Redirects = new Meteor.Collection("redirects");

Template.newpara.events({
  'click': function(evt) {
    var pageName = Session.get("page_name");
    var index = Paras.find({page: pageName}).count() + 1;
    var p = Paras.insert({
      index: index,
      'page': pageName,
      'content': ["Make this paragraph say what you want it to."]
    })
    Session.set("editing_para", p);
    Meteor.flush(); // force DOM redraw, so we can focus the edit field
    activateInput($("#para-textarea")); // XXX hacky - assumes only one such thing in page.
  }
})


Template.newpage.events({
  'click': function(evt) {
    // this creates a paragraph containing a link to a page that doesn't exist.
    // and inserts it at the end of the current page.
    var pageName = Session.get("page_name");
    var names = ['new page', 'another new page', 'a random new page'];
    var newpage = null;
    var newpagename = '';
    var i = 0;
    while (!newpage) {
      newpage = Pages.findOne({name: names[i]});
      if (newpage) i++;
      if (i > names.length) {
        newpagename = 'new page ' + i.toString()
      } else {
        newpagename = names[i];
      }
      if (!newpage) break;
    }
    var index = Paras.find({page: pageName}).count() + 1;
    Paras.insert({
      index: index,
      'page': pageName,
      'content': ["Link to a [[" + newpagename + "]]"]
    })
  }
})

Template.heartedpages.pages = function() {
  return Pages.find({starred: true}, {sort: {name: 1}}); // alpha
};

Template.recentpages.pages = function() {
  return Pages.find({}, {sort: {mtime: -1}}); // most recently modified first
};


Template.editablepagetitle.editing_title = function() {
  return Session.get("editing_title");
}

Template.editablepagetitle.events({
  'click span.pagetitle': function(evt, tmpl) {
    Session.set("editing_title", true);
    Meteor.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(tmpl.find("#title-input"));
  },
  'keydown #title-input': function(evt, tmpl) {
    if (evt.which == 13) {
      Session.set("editing_title", null);
      var oldpagename = Session.get('page_name');
      var newpagename = tmpl.find("#title-input").value;
      var page = Pages.findOne({name: oldpagename});
      if (!page) return;
      var paras = Paras.find();
      Pages.update(page._id, {$set: {name: newpagename}})
      console.log("tweaking " + Paras.find({'page': oldpagename}).count() + "paras");
      Paras.update({'page': oldpagename}, {$set: {page: newpagename}})
      Session.set("page_name", newpagename);
      // register a redirect serverside
      Redirects.insert({old_name: oldpagename, new_name: newpagename})
    }
  }
})

Template.heart.starred = function() {
  var pageName = Session.get("page_name");
  if (!pageName) return false;
  var page = Pages.findOne({'name': pageName});
  if (!page) return false;
  return page.starred && true;
}

Template.heart.events({
  'click i.heart': function(evt, tmpl) {
    var page = Pages.findOne({'name': Session.get("page_name")}, {sort: {name: 1}});
    Pages.update(page._id, {$set: {starred: !page.starred}})
  }
})

Template.page.currentPage = function () {
  var pageName = Session.get("page_name");
  if (!pageName) return '';
  var redirect = Redirects.findOne({old_name: pageName});
  if (redirect) {
    // this is an actual client-side redirect, kinda cute!
    Session.set("page_name", redirect.new_name);
    return redirect.new_name;
  } else {
    return pageName.trim();
  }
  return '';
};

Template.page.paras = function() {
	var pageName = Session.get("page_name");
	var paras = Paras.find({"page": pageName}, {sort: {index: 1}});
  return paras
}

Template.para.editing = function () {
  return Session.equals('editing_para', this._id);
};

function confirmPageExists(pageName) {
  var timestamp = (new Date()).getTime();
  page = Pages.findOne({name: pageName});
  if (page) {
    Pages.update(page._id,
      {$set: {
        name: pageName,
        mtime: timestamp}
      });
    return;
  }
  console.log("creating page as it doesn't exist")
  Pages.insert({name: pageName, 
    mtime: timestamp
  });
};


function handleInternalLinkClick(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var target = evt.target.getAttribute('data');
  Session.set("page_name", unescape(target));
};

function fixupIndices() {
  var pageName = Session.get("page_name");
  var paras = Paras.find({page: pageName}, {sort: {index: 1}});
  var index = 0;
  paras.forEach(function(para) {
    Paras.update(para._id, {$set: {index: index}});
    index++;
  });
}

function endParagraphEditing(id, index, contents) {
  // trim leading and trailing whitespace
  var contents = $.trim(contents);
  var pageName = Session.get("page_name");
  // if it's empty, get rid of it.
  if (contents.length == 0) {
    Paras.remove(id);
  } else {
    var subparas = contents.split(/\n+/);
    var numsubparas = subparas.length;
    // if it has double newlines, split it
    if (numsubparas > 1) {
      Paras.remove(id); // remove the old one
      for (var i = 0; i < subparas.length; i++) {
        Paras.insert({
          page: pageName,
          index: index + (i / numsubparas), 
          content: [subparas[i]]
        });
      }
    } else {
      Paras.update({_id: id}, {
        page: pageName,
        index: index, 
        content: [contents]
      });
    }
  }
  fixupIndices();
  Session.set("editing_para", null);

  confirmPageExists(pageName);
}

var activateInput = function (input) {
  input.focus();
  input.select();
};

var startEditParagraph = function(para, tmpl) {
    Session.set("editing_para", para._id);
    Meteor.flush(); // force DOM redraw, so we can focus the edit field
    activateInput(tmpl.find("#para-textarea"));
}

Template.page.events({
  'click .edit-handle': function(evt, tmpl) {
    evt.stopPropagation();
    evt.preventDefault();
    startEditParagraph(this, tmpl);
  },

  'click i.done-handle': function(evt, template) {
    var para = $(evt.target).parent();
    var textarea = para.find("textarea").val();
    endParagraphEditing(this._id, this.index, textarea);

  },

  'click span.editable': function (evt, tmpl) {
    evt.stopPropagation();
    evt.preventDefault();
    startEditParagraph(this, tmpl)
    // Session.set("editing_para", this._id);
  },

  'keydown p.para': function(evt) {
    if (evt.which == 27) {
      endParagraphEditing(this._id, this.index, evt.target.value);
      // Paras.update({_id: this._id}, {
      //   page: this.page, 
      //   index: this.index, 
      //   content: []});
      // Session.set("editing_para", null);
      // confirmPageExists(this.page);
    }
  },

  'click a.internal': handleInternalLinkClick
});

Template.recentpages.events({
  'click a.internal': handleInternalLinkClick
})

asSlug = function(name) {
  return name;
//  return name.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
};

renderInternalLink = function(match, name) {
  var slug = asSlug(name);
  return "<a class=\"internal\" data=\"" + slug + "\" href=\"/" + slug + "\" title=\"" + "\">" + name + "</a>";
};

Handlebars.registerHelper('linkify', function(content, options) {
  var retval = content[0].replace(/\[\[([^\]]+)\]\]/gi, renderInternalLink).replace(/\[(http.*?) (.*?)\]/gi, "<a class=\"external\" target=\"_blank\" href=\"$1\" title=\"$1\" rel=\"nofollow\">$2</a>");
  return new Handlebars.SafeString(retval);
});


var PagesRouter = Backbone.Router.extend({
  routes: {
    ":page_name": "main",
    "": "index"
  },
  index: function() {
    Session.set("page_name", "Welcome");
  },
  main: function (page_name) {
  	console.log("in main handler, page_name is ", unescape(page_name));
    // debugger;
    Session.set("page_name", unescape(page_name));
  },
});

Router = new PagesRouter;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

// Subscribe to 'pages' collection on startup.
// Select a list once data has arrived.
Meteor.subscribe('pages', function () {
  if (!Session.get('page_name')) {
    var page = Pages.findOne({}, {sort: {name: 1}});
    if (page)
      Router.setPage(page.name);
  }
});
