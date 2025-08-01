// Includes
const http = require('../util/http.js').func
const cache = require('../cache')
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group', 'userId']

// Docs
/**
 * ✅ Get a user's rank name in a group.
 * @category Group
 * @alias getRankNameInGroup
 * @param {number} group - The id of the group.
 * @param {number} userId - The id of the user.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * const rankName = await noblox.getRankNameInGroup(1, 1)
**/

// Define
function getRankNameInGroup (group, userId) {
  if (typeof group === 'string') {
    if (!isNaN(group)) {
      // It's a number in a string
      group = parseInt(group, 10)
    } else {
      throw new Error('Group id should be a number')
    }
  }
  return http({ url: `//groups.roblox.com/v2/users/${userId}/groups/roles`, options: { json: true, resolveWithFullResponse: true } }).then((res) => {
    if (res.statusCode !== 200) throw new RobloxAPIError(res)
    const groupObject = res.body.data.find((info) => group === info.group.id)

    return groupObject ? groupObject.role.name : 'Guest'
  })
}

exports.func = function (args) {
  const id = args.userId
  return cache.wrap('Rank', id + 'Name', function () {
    return getRankNameInGroup(args.group, id)
  })
}
