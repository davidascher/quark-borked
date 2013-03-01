// This keeps user-authored stuff indexed in sqlite

var sqlite3 = require('sqlite3');
var allparas = Paras.find();
var Future = require('fibers/future'), wait = Future.wait;
var db;

// var searchForATerm = Fiber(function(rows) {
// 	Meteor._debug("starting fiber, db=", db);
//   	// SQL injection prevention code goes here. =()
// 	Meteor._debug("got rows from FTS:", rows);
// 	if (rows)
// 		Fiber.yield(rows);
// 	else 
// 		Fiber.yield('Nope.');
// });


//    someAsyncFunction(arg, function (err, ret) {
//      doSomethingWith(ret);
//    });

// you write

//   var ret = Future.wrap(someAsyncFunction)(arg);
//   doSomethingWith(ret);

Meteor.methods({
  search: function (term) {
  	Meteor._debug("doing a search for ", term);
  	var arg = "SELECT key FROM paragraphs WHERE data MATCH '" + term + "'";
  	Meteor._debug("arg =", arg);
  	Meteor._debug(Future.wrap(db.run));
  	rows = Future.wrap(db.run)(arg);
  	Meteor._debug("rows", rows);
	return rows;
  }
});

var onParaChange = {
	added: function(id, fields) {
		// Meteor._debug("added", id, fields);
		db.run("INSERT INTO paragraphs VALUES ($key, $data)", {
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

db = new sqlite3.Database('paragraphs.sqlite3', function() {
	console.log("DB = ", db);
	console.log("createTable paragraphs");
	db.run("CREATE VIRTUAL TABLE paragraphs USING fts4(key, data);", function() {});
});
Meteor.startup(function () {
	allparas.observeChanges(onParaChange)
});

