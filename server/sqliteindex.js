// This keeps user-authored stuff indexed in sqlite

var allparas = Paras.find();
var db;


Meteor.startup(function () {
	db = new sqlite3.Database('paragraphs.sqlite3', createTable);
    console.log("createTable paragraphs");
    db.run("CREATE VIRTUAL TABLE IF NOT EXISTS webpages USING fts4(key, data);", mongoOpen)
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
	},
	removed: function(id) {
		Meteor._debug("removed", id);
	}
}

allparas.observeChanges(onParaChange)
