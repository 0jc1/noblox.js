const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationId', 'isTyping']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Trigger the typing action in a conversation.
 * @category Chat
 * @alias setChatUserTyping
 * @param {number} conversationId - The id of the conversation.
 * @param {boolean} isTyping - If the user is typing.
 * @returns {Promise<UpdateTypingResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setChatUserTyping(1, true)
**/

function setChatUserTyping (conversationId, isTyping, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/update-user-typing-status',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          conversationId,
          isTyping
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt).then((res) => {
      if (res.statusCode === 200) {
        if (!res.body.resultType === 'Success') {
          reject(new RobloxAPIError(res))
        } else {
          resolve(res.body)
        }
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return setChatUserTyping(args.conversationId, args.isTyping, jar, xcsrf)
  })
}
