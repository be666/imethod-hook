let loopback = require('loopback');

function rewriteUserLiteral(req, currentUserLiteral) {
  if (req.accessToken && req.accessToken.userId && currentUserLiteral) {
    // Replace /me/ with /current-user-id/
    var urlBeforeRewrite = req.url;
    req.url = req.url.replace(
      new RegExp('/' + currentUserLiteral + '(/|$|\\?)', 'g'),
      '/' + req.accessToken.userId + '$1');
    if (req.url !== urlBeforeRewrite) {

    }
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function token(options) {
  options = options || {};
  var TokenModel;
  let AccessToken;

  var currentUserLiteral = options.currentUserLiteral;
  if (currentUserLiteral && (typeof currentUserLiteral !== 'string')) {
    currentUserLiteral = 'me';
  }
  if (typeof currentUserLiteral === 'string') {
    currentUserLiteral = escapeRegExp(currentUserLiteral);
  }


  return function (req, res, next) {
    if (req.accessToken) {
      return next();
    }

    if (!TokenModel) {
      TokenModel = loopback.getModel('AuthAccessToken');
      AccessToken  = loopback.getModel('AccessToken');
    }
    TokenModel.findForRequest(req, options, function (err, token) {
      req.accessToken = token || null;
      rewriteUserLiteral(req, currentUserLiteral);
      var ctx = loopback.getCurrentContext();
      if (ctx) {
        ctx.set('accessToken', token);
      }
      next(err);
    });
  };
}

module.exports = token;
