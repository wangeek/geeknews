module.exports = function (app) {
  //user
  var User = app.models.writer;
  User.create({ email: 'foo@bar.com', password: 'bar' }, function (err, userInstance) {
    console.log(userInstance);
  });
  //story
  var Story = app.models.story;
  Story.create({
    title: 'San Francisco’s Seismic Gamble',
    content: '......',
    create_on:Date(),
    writer_id: '1'
  }, function (err, storyInstance) {
    console.log(storyInstance);
  });
  Story.create({
    title: 'World After Capital: Scarcity',
    content: 'HAHA',
    create_on:Date(),
    writer_id: '1'
  }, function (err, storyInstance) {
    console.log(storyInstance);
  });
  // comments
  var Comment = app.models.comment;
  Comment.create({
    content: 'Like this',
    writer_id: 1,
    create_on:Date(),
    story_id:1
  }, function (err, ins) {
    console.log(ins);
  });
}