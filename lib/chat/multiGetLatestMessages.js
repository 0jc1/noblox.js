const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationIds']
exports.optional = ['pageSize', 'jar']

// Docs
/**
 * 🔐 Get multiple of the latest messages.
 * @category Chat
 * @alias multiGetLatestMessages
 * @param {Array<number>} conversationIds - An array with the conversationIds.
 * @returns {Promise<ChatConversationWithMessages[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const recentMessages = await noblox.multiGetLatestMessages([1, 2, 3])
**/

exports.func = (args) => {
  const jar = args.jar
  const conversationIds = typeof (args.conversationIds) === 'object' ? args.conversationIds : []
  const pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30

  return http({
    url: '//chat.roblox.com/v2/multi-get-latest-messages?pageSize=' + pageSize + '&conversationIds=' + conversationIds.join('&conversationIds='),
    options: {
      method: 'GET',
      jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new RobloxAPIError(res)
    } else {
      return JSON.parse(res.body)
    }
  })
}
