// This keeps user-authored stuff indexed in sqlite

var sqlite3 = require('sqlite3');
var allparas = Paras.find();
var db;


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
		db.run("INSERT OR REPLACE INTO paragraphs VALUES ($key, $data)", {
			$key: id,
			$data: fields['content'][0]
		})
	},
	removed: function(id) {
		Meteor._debug("removed", id);
	}
}

// function setupSqlite() {
//   Fiber(function() { 
//   }).run();
// }

db = new sqlite3.Database('paragraphs.sqlite3', function() {
	console.log("DB = ", db);
	console.log("createTable paragraphs");
	db.run("CREATE VIRTUAL TABLE paragraphs USING fts4(key, data);", function() {});
});
Meteor.startup(function () {
	// setupSqlite();
	allparas.observeChanges(onParaChange)
});

