// Dependencies
var request = require('request');

// Define
module.exports = function(jar,url,callback,callbacks) {
  request.post(url,{jar: jar},function(err,res,body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    if (res.headers['x-csrf-token'])
      callback(res.headers['x-csrf-token']);
    else {
      if (callbacks.failure)
        callbacks.failure('Could not retrieve X-CSRF-TOKEN.');
      return console.error('Could not retrieve X-CSRF-TOKEN.');
    }
  });
};
