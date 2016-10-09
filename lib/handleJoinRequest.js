// Dependencies
var cheerio = require('whacko');

// Includes
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getGeneralToken = require('./util/getGeneralToken.js').func;

// Args
exports.args = ['group', 'username', 'accept', 'jar'];

// Define
function joinRequestId (jar, group, username) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/My/GroupAdmin.aspx?gid=' + group,
      options: {
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (body) {
      var searchUrl = body.match('Roblox\.GroupAdmin\.InitializeGlobalVars\(.*".*", "(.*)", .*\)')[2];
      var httpOpt = {
        url: '//www.roblox.com' + searchUrl + '?groupId=' + group + '&username=' + username,
        options: {
          jar: jar
        }
      };
      http(httpOpt)
      .then(function (body) {
        var $ = cheerio.load(body);
        var id = $('[data-rbx-join-request]').attr('data-rbx-join-request');
        if (id) {
          resolve(id);
        } else {
          reject(new Error('No join request was found with that username'));
        }
      });
    });
  };
}

function handleJoinRequest (jar, token, accept, requestId) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/group/handle-join-request',
      options: {
        method: 'POST',
        jar: jar,
        form: {
          groupJoinRequestId: requestId,
          accept: accept
        },
        headers: {
          'X-CSRF-TOKEN': token
        }
      }
    };
    http(httpOpt)
    .then(function (body) {
      if (JSON.parse(body).success) {
        resolve();
      } else {
        reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to handle join requests'));
      }
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  return promise(joinRequestId(jar, args.group, args.username))
  .then(function (requestId) {
    return getGeneralToken({jar: jar})
    .then(function (xcsrf) {
      return promise(handleJoinRequest(jar, xcsrf, args.accept, requestId));
    });
  });
};
