// Dependencies
var cheerio = require('whacko');
var entities = require('entities');

// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.args = ['group', 'message', 'jar'];

// Define
function post (jar, oldBody, res, message) {
  return function (resolve, reject) {
    if (res.statusCode === 200) {
      var $ = cheerio.load(res.body);
      var old = cheerio.load(oldBody);
      var oldTime = old('.RepeaterText').children('div').find('.GroupWall_PostDate').text().trim();
      var newObj = $('.RepeaterText').children('div');
      var newTime = newObj.find('.GroupWall_PostDate').text().trim();
      // Check that the message is updated and the post time is not the same
      if (oldTime !== newTime && newObj.eq(0).text().trim() === entities.decodeXML(message)) {
        resolve();
      } else {
        reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to post on the group wall'));
      }
    } else {
      reject(new Error('Wall post failed'));
    }
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  var message = args.message;
  var events = {
    ctl00$cphRoblox$GroupWallPane$NewPost: message,
    ctl00$cphRoblox$GroupWallPane$NewPostButton: 'Post'
  };
  return generalRequest({jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events, getBody: true})
  .then(function (result) {
    return promise(post(jar, result.body, result.res, message));
  });
};
