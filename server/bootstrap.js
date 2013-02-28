// if the database is empty on server start, create some sample data.
var bootstrap_data_path = './recipes';

Meteor.startup(function () {
  if (Pages.find().count() === 0) {
    var data = [
      {name: "Welcome",
       contents: [
         ["This is a first paragraph"],
         ["This is a second paragraph linking to [[Other page]]"],
         ["This is a third paragraph"]
       ]
      },
      {name: "Other page",
       contents: [
         ["This is a first paragraph"],
         ["This is a second paragraph paragraph"],
         ["This is a third paragraph linking back to the [[Welcome]] page."]
       ]
      }
    ];
    Redirects.insert({'old_name': 'xxx', 'new_name': 'xxy'})

    for (var i = 0; i < data.length; i++) {
      var timestamp = (new Date()).getTime();
      var list_id = Pages.insert({name: data[i].name, mtime: timestamp});
      for (var j = 0; j < data[i].contents.length; j++) {
        Paras.insert({index: j, page: data[i].name, content: data[i].contents[j]})
      }
    }
    // load recipes from disk
    if (fs.existsSync(bootstrap_data_path)) {
      fs.readdirSync(bootstrap_data_path, function(err, files) {
        for (var k = 0; k < files.length; k++) {
          var filepath = path.join(bootstrap_data_path, files[k]);
          console.log(filepath);
          var app_html = fs.readFileSync(filepath, 'utf8');
        }

      })
    }
  }
});
