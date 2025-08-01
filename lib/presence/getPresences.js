// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userIds']
exports.optional = []

// Docs
/**
 * 🔐 Get the presence status of users.
 * @category Presence
 * @alias getPresences
 * @param {Array<number>} userIds - An array of userIds.
 * @returns {Promise<Presences>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const presences = await noblox.getPresences([1, 2, 3])
**/

// Define
function getPresences (userIds, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//presence.roblox.com/v1/presence/users',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds
        })
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          reject(new RobloxAPIError(res))
        } else {
          resolve(responseData)
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return getPresences(args.userIds, args.jar, xcsrf)
    })
}
