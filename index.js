// Description:
//   An unsafe way to interact with the Google Images API.

module.exports = function(robot) {
  robot.helpCommand("brobbot unsafe [me] `query`", "Googles `query` with SafeSearch turned off, and returns 1st image result's URL.");

  robot.respond(/^unsafe( me)? (.*)/i, function(msg) {
    imageMe(msg, msg.match[2], function(url) {
      msg.send(url);
    });
  });
};

function imageMe(msg, query, cb) {
  var q = {
    v: '1.0',
    rsz: '8',
    q: query,
    safe: 'off'
  };

  msg.http('http://ajax.googleapis.com/ajax/services/search/images')
    .query(q)
    .get()(function(err, res, body) {
      var images = JSON.parse(body);
      images = images.responseData ? images.responseData.results : null;

      if (images && images.length > 0) {
        image = msg.random(images);
        cb(ensureImageExtension(image.unescapedUrl));
      }
    });
}

function ensureImageExtension(url) {
  var ext = url.split('.').pop();
  if (/(png|jpe?g|gif)/i.test(ext)) {
    return url;
  }
  else {
    return url + "#.png";
  }
}
