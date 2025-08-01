// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['tradeId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get detailed information for a specific trade.
 * @category Trade
 * @alias getTradeInfo
 * @param {number} tradeId - The id of the trade.
 * @returns {Promise<TradeInfo>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const tradeInfo = await noblox.getTradeInfo(1234)
**/

// Define
const getTradeInfo = (jar, tradeId) => {
  return new Promise((resolve, reject) => {
    http({
      url: '//trades.roblox.com/v1/trades/' + tradeId,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body)
        body.created = new Date(body.created)
        if (body.expiration) body.expiration = new Date(body.expiration)

        resolve(body)
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  return getTradeInfo(args.jar, args.tradeId)
}
