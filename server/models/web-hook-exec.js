let exec = require('child_process').exec;
let path = require('path');
let clientPath = path.resolve(__dirname, '../../bin/client.sh');
let serverPath = path.resolve(__dirname, '../../bin/server.sh');
module.exports = function (WebHookExec) {

  WebHookExec.resolveRelatedModels = function () {
    if (!this.WebHook) {
      var reg = this.registry;
      this.WebHook = reg.getModel('WebHook');
    }
  };

  let clientCmd = function (directory, versionId, next) {

    exec(`${clientPath} ${directory} ${versionId}`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err||stderr) {
        return next(err, stdout, stderr);
      }
      console.log(stdout);
      console.log(stderr);
    });
  };

  let serverCmd = function (directory, versionId, next) {
    exec(`${serverPath} ${directory} ${versionId}`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err||stderr) {
        return next(err, stdout, stderr);
      }
      console.log(stdout);
      console.log(stderr);
    });
  };

  WebHookExec.push = function (repositoryName, ref, after, info, next) {
    WebHookExec.resolveRelatedModels();
    console.log(ref);
    let WebHook = WebHookExec.WebHook;
    WebHook.findOne({
      where: {
        repositoryName: repositoryName,
        ref: ref
      }
    }).then(function (webHook) {
      if (!webHook) {
        return next();
      }
      WebHookExec.create({
        WebHookId: webHook.id,
        action: 'push',
        info: JSON.stringify(info),
        receiveTime: new Date(),
        execStatus: 0
      }).then(function (webHookExec) {
        if (!webHookExec) {
          return next();
        }
        if (webHook.pushCMD == 'client') {
          clientCmd(webHook.directory, after, function (err, stdout, stderr) {
            webHookExec.error = JSON.stringify(err||'{}');
            webHookExec.stdout = stdout;
            webHookExec.stderr = stderr;
            webHookExec.save(function (err) {
              console.log(err)
            });
          });
        } else if (webHook.pushCMD == 'server') {
          serverCmd(webHook.directory, after, function (err, stdout, stderr) {
            webHookExec.error = JSON.stringify(err||'{}');
            webHookExec.stdout = stdout;
            webHookExec.stderr = stderr;
            webHookExec.save(function (err) {
              console.log(err)
            });
          });
        }
        next();
      }).catch(function (err) {
        console.log(err);
        next(err);
      })
    }).catch(function (err) {
      console.log(err);
      next(err);
    })
  }
};
