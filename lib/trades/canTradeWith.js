// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Check if the signed in user can trade with another user.
 * @category Trade
 * @alias canTradeWith
 * @param {number} userId - The id of the user.
 * @returns {Promise<CanTradeResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const canTrade = await noblox.canTradeWith(1234)
**/

// Define
function canTradeWith (jar, userId) {
  return new Promise((resolve, reject) => {
    http({
      url: '//trades.roblox.com/v1/users/' + userId + '/can-trade-with',
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        resolve(JSON.parse(res.body))
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  return canTradeWith(args.jar, args.userId)
}
