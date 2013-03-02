// This keeps user-authored stuff indexed in sqlite

var sqlite3 = require('sqlite3');
var allparas = Paras.find();
var Future = require('fibers/future'), wait = Future.wait;
var db;


Meteor.methods({
  search: function (term) {
  	Meteor._debug("in search");
    var fut = new Future();
    db.all("SELECT DISTINCT key FROM paragraphs WHERE data MATCH '" + term + "';", function(err, rows) {
    	fut.ret(rows);
    })
    return fut.wait();
  }
});

var onParaChange = {
	added: function(id, fields) {
		// Meteor._debug("added", id, fields);
		// using OR REPLACE in case we're getting replays by meteor.
		db.run("INSERT OR REPLACE INTO paragraphs VALUES ($key, $data)", {
			$key: id,
			$data: fields['content'][0]
		})
	},
	changed: function(id, fields) {
		// Meteor._debug("changed", id, fields);
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

db = new sqlite3.Database('../paragraphs.sqlite3', function() {
	console.log("DB = ", db);
	console.log("createTable paragraphs");
	db.run("CREATE VIRTUAL TABLE paragraphs USING fts4(key, data);", function() {});
});
Meteor.startup(function () {
	allparas.observeChanges(onParaChange)
});

