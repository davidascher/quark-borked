// This keeps user-authored stuff indexed in sqlite

var allparas = Paras.find();

var db = new sqlite3.Database('webpages.sqlite3', createTable);
function createTable() {
    console.log("createTable webpages");
    db.run("CREATE VIRTUAL TABLE webpages USING fts4(url, data);", mongoOpen)
}

db.run("INSERT INTO webpages VALUES ($url, $data)", {
	$url: url,
	$data: data
})


function closeDb() {
    console.log("closeDb");
    db.close();
}



var onParaChange = {
	added: function(id, fields) {
		Meteor._debug("added", id, fields);
	},
	changed: function(id, fields) {
		Meteor._debug("changed", id, fields);
	},
	removed: function(id) {
		Meteor._debug("removed", id);
	}
}

allparas.observeChanges(onParaChange)
