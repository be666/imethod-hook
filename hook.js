'use strict';
var gith = require('gith').create(1438);  // run on port 6000
var exec = require('child_process').exec;

gith({
  repo: 'syngentech/van',
  branch: 'van-web'
}).on('all', function (payload) {

  console.log("receive : git deployed to branch " + payload.branch + " commitId: " + payload.sha);

  if (payload.branch != 'van-web') {
    return
  }

  console.log("exec :" + __dirname + '/hook.sh ' + 'van-web ' + payload.sha);

  exec(__dirname + '/hook.sh ' + payload.sha, function (err, stdout, stderr) {
    if (err) {
      console.log(err)
      return err;
    }
    console.log(stdout);
    console.log("success : branch: " + payload.branch + " commitId: " + payload.sha);
  });
});
