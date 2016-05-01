// Dependencies
var http = require('./util/http.js').func;
var getVerification = require('./util/getVerification.js').func;
var promise = require('./util/promise.js');
var cheerio = require('cheerio');

// Args
exports.args = ['group', 'message', 'jar'];

// Define
function shout (jar, oldBody, post, group, message) {
  return function (resolve, reject) {
    post.ctl00$cphRoblox$GroupStatusPane$StatusTextBox = message || '';
    post.ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton = 'Group Shout';
    var httpOpt = {
      url: 'https://www.roblox.com/My/Groups.aspx?gid=' + group,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        form: post,
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var $ = cheerio.load(res.body);
        var old = cheerio.load(oldBody);
        var query = '#ctl00_cphRoblox_GroupStatusPane_StatusDate';
        // Check that the message is updated and the post time is not the same
        if (old(query).text() !== $(query).text() && $('#ctl00_cphRoblox_GroupStatusPane_StatusTextField').text() === message) {
          resolve();
        } else {
          reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to shout'));
        }
      } else {
        reject(new Error('Shout failed'));
      }
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  return getVerification({url: 'https://www.roblox.com/My/Groups.aspx?gid=' + group, jar: jar, getBody: true})
  .then(function (response) {
    return promise(shout(jar, response.body, response.inputs, group, args.message));
  });
};
