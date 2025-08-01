const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationId', 'userIds']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Add users to a conversation.
 * @category Chat
 * @alias addUsersToConversation
 * @param {number} conversationId - The id of the conversation.
 * @param {Array<number>} userIds - The userIds of the users to add.
 * @returns {Promise<ConversationAddResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.addUsersToConversation(1, [1, 2, 3])
**/

function addUsersToConversation (conversationId, userIds, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/add-to-conversation',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          conversationId,
          participantUserIds: userIds
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
    return addUsersToConversation(args.conversationId, args.userIds, jar, xcsrf)
  })
}
