// Dependencies
var request = require('request-promise').defaults({
  pool: {maxSockets: Infinity},
  simple: false
});

// Includes
var options = require('../options.js');

// Args
exports.required = ['url'];
exports.optional = ['options'];

// Define
function http (url, opt) {
  if (opt && !opt.jar && Object.keys(opt).indexOf('jar') > -1) {
    opt.jar = options.jar;
  }
  if (options.sessionOnly && opt && opt.jar) {
    if (!opt.headers) {
      opt.headers = {};
    }
    opt.headers.cookie = '.ROBLOSECURITY=' + opt.jar.session + ';';
  }
  if (url.indexOf('http') !== 0) {
    url = 'https:' + url;
  }
  return request(url, opt).catch(function (err) {
    console.error('Http error: ' + err.stack);
  });
}

exports.func = function (args) {
  var promise = http(args.url, args.options);
  var handler = options.errorHandler;
  if (handler) {
    return promise.catch(options.errorHandler);
  } else {
    return promise;
  }
};
