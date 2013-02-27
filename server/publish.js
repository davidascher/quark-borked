// Pages -- {name: String}
Pages = new Meteor.Collection("pages");
Paras = new Meteor.Collection("paras");

// // Publish complete set of lists to all clients.
// Meteor.publish('pages', function () {
//   return Pages.find();
// });
