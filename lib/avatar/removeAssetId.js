const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['assetId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Removes an asset from your avatar.
 * @category Avatar
 * @alias removeAssetId
 * @param {number} assetId - The assetId to remove.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.removeAssetId(1)
**/

function removeAssetId (assetId, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: 'https://avatar.roblox.com/v1/avatar/assets/' + assetId + '/remove',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        },
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode !== 200) {
          reject(new RobloxAPIError(res))
        } else {
          resolve()
        }
      }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return removeAssetId(args.assetId, jar, xcsrf)
  })
}
