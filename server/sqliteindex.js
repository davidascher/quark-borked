// This keeps user-authored stuff indexed in sqlite

var sqlite3 = require('sqlite3');
var allparas = Paras.find();
var db;

function searchForATerm() {
	var fiber = Fiber(function() {
	  	// SQL injection prevention code goes here. =()
		db.run("SELECT key FROM paragraphs WHERE data MATCH '" + term + "'", function(err, rows) {
	    	Meteor._debug(rows);
			Fiber.yield(rows);
		});
	});
	return fiber.run.bind(fiber);
}

Meteor.methods({
  search: function (term) {
  	return searchForATerm(term);
    // 	Fiber.yield(rows);
    // });
    // if (you want to throw an error)
    //   throw new Meteor.Error(404, "Can't find my pants");
    // return "some return value";
  },

  bar: function () {
    // .. do other stuff ..
    return "baz";
  }
});

var onParaChange = {
	added: function(id, fields) {
		Meteor._debug("added", id, fields);
		db.run("INSERT INTO paragraphs VALUES ($key, $data)", {
			$key: id,
			$data: fields['content'][0]
		})
	},
	changed: function(id, fields) {
		Meteor._debug("changed", id, fields);
		if (fields['content']) { // some updates are just index tweaks for example
			db.run("INSERT OR REPLACE INTO paragraphs VALUES ($key, $data)", {
				$key: id,
				$data: fields['content'][0]
			})
		}
	},
	removed: function(id) {
		Meteor._debug("removed", id);
	}
}

db = new sqlite3.Database('paragraphs.sqlite3', function() {
	console.log("DB = ", db);
	console.log("createTable paragraphs");
	db.run("CREATE VIRTUAL TABLE paragraphs USING fts4(key, data);", function() {});
});
Meteor.startup(function () {
	allparas.observeChanges(onParaChange)
});

