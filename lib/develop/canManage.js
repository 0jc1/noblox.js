// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId', 'assetId']

// Docs
/**
 * ✅ Returns whether the user can manage a given asset.
 * @category Develop
 * @alias canManage
 * @param {number} userId - The id of the user.
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * let canManage = await noblox.canManage(123456, 234567)
**/

// Define
function canManage (userId, assetId) {
  return http({
    url: `//develop.roblox.com/v1/user/${userId}/canmanage/${assetId}`,
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  })
    .then(function (res) {
      const { body } = res
      const { Success: success, CanManage: canManage } = JSON.parse(body)
      if (success) {
        return canManage
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ userId, assetId }) {
  return canManage(userId, assetId)
}
