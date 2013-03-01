// This keeps user-authored stuff indexed in sqlite

var allparas = Paras.find();

var onParaChange = {
	added: function(id, fields) {
		// console.log("added", id, fields);
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
