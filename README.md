# roblox-js
## About

Roblox-js is a node module that provides functions for performing actions on [roblox](http://www.roblox.com), mostly for use with their HttpService feature.

## Usage
ROBLOX user sessions are stored in a `CookieJar`, which can be created like so:
```javascript
var request = require('request');
var jar = request.jar();
```
Be default, however, there is a single global cookie jar stored in the module which will automatically be used if you don't specify a custom jar. You can get the global cookie jar with the `getJar` function and set a new one with `setJar`.

The login function populates the cookie jar with the users cookies, including their `.ROBLOSECURITY` (session), if successful and any functions that perform non-guest actions need a cookie jar to do so. If you are only using this module for a single group with one promotion user I recommend simply using the default global cookie jar.

Be aware that you must set something to refresh this token every once in a while: otherwise it will expire. Logging in every server restart and making a login interval of 1 day should be enough.

Also remember to check the scripts in the examples and tests folder to see the module in action.

Function usage is below.

## Documentation Info

All functions have alternate forms, arguments are either passed:
- Through a single options object
- Individually

The options object has all the arguments listed are manually named.

For example, you could do:
```javascript
login('shedletsky','hunter2',jar, function() {
  console.log('It worked!');
});
```
_or_
```javascript
var options = {
  username: 'shedletsky',
  password: 'hunter2',
  jar: jar,
  success: function() {
    console.log('It worked!');
  }
}

login(options);
```

_Note that raw functions (required individually) do not support alternate forms. Furthermore, their arguments may not be the same or be in the same order: to find them you have to go into the source and check for yourself._

_Success, failure, and always callbacks are executed when the goal of the function: succeeds, fails, or runs at all, respectively._

_Cookie jars are all optional, if one isn't specified the function will automatically use the default global cookie jar._

## Main functions

Includes `setRank`.

### setRank(group, target, roleset[, token, jar, success, failure, always])
Changes the role of `target` (UserID) in `group` to `roleset` or returns a general error if unsuccessful. Token is the X-CSRF-TOKEN and should only be included if you intend to manually handle them (normally they are automatically retrieved every request).

options [object]:
- group: number,
- target: number,
- roleset: number,
- rank: number
  - _NOTE: Rank can only be used in the options array and will override roleset (making it not required). The rank in the specified group will be converted to its corresponding roleset id._
- _optional_ token: string,
- _optional_ jar: CookieJar,
- _optional_ success: function,
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### exile(group, target[, deleteAllPosts, senderRoleSetId, token, jar, success, failure, always])
Exiles `target` in `group` and returns a general error if unsuccessful. Token is the X-CSRF-TOKEN and should only be included if you intend to manually handle them (normally they are automatically retrieved every request).

options [object]:
- group: number
- message: string
- _optional_ deleteAllPosts: boolean,
 - _Defaults to false._
- _optional_ senderRoleSetId: number,
  - _Used for custom handling of the sender's roleset, which is required by the exile API. If not specified_ `getRolesetInGroupWithJar` _will be used._
- _optional_ token: string,
- _optional_ jar: CookieJar,
- _optional_ success: function,
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### message(recipient, subject, body[, token, jar, success, failure, always])
Message `recipient` with the message `body` and subject `subject` and returns a detailed error if unsuccessful. Token is the X-CSRF-TOKEN and should only be included if you intend to manually handle them (normally they are automatically retrieved every request).

options [object]:
- recipient: number,
- subject: string,
- body: string,
- _optional_ token: string,
- _optional_ jar: CookieJar,
- _optional_ success: function,
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### shout(group, message[, jar, success, failure, always])
Shouts `message` in `group` and returns a general error if unsuccessful.

options [object]:
- group: number
- message: string
- _optional_ jar: CookieJar,
- _optional_ success: function,
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### post(group, message[, jar, success, failure, always])
Posts `message` on `group` wall and returns a general error if unsuccessful.

options [object]:
- group: number
- message: string
- _optional_ jar: CookieJar,
- _optional_ success: function,
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

## Utility Functions

Includes `login`,`getRoles`,`getCurrentUser`,`getSettings`.

### login(username, password[, jar, success, failure, always])
Logs in with `username` and `password` and puts the new cookie into `jar` (or the default global jar if unspecified) or returns a detailed error if unsuccessful.

options [object]:
- username: string,
- password: string,
- _optional_ jar: CookieJar,
- _optional_ success: function,
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### getToken(url[, jar, callback, failure])
Sends the X-CSRF-TOKEN used by the URL to `callback`. This only needs to be used if you want to custom handle tokens, normally it is handled automatically.

options [object]:
- url: string
- _optional_ jar: CookieJar
- _optional_ callback: function,
  - `token [string]`
- _optional_ failure: function,
  - `error [string]`

### getRoles(group[, rank, success, failure, always])
Returns role information of a group in the form `[{"ID":number,"Name":"string","Rank":number},{"ID":number,"Name":"string","Rank":number}]`. To best used with `setRank`.

options [object]:
- group: number,
- _optional_ rank: number
  - _Used to select a specific role from the roles array._
- _optional_ success: function,
  - `roles [object]`
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### getCurrentUser([option, jar, success, failure, always])
Gets the current user from the ROBLOX website and feeds `option` or all options if successful, otherwise returns detailed error.

options [object]:
- _optional_ option: string
 - Any one:
  - `UserID`, `UserName`, `RobuxBalance`, `TicketsBalance`, `ThumbnailUrl`, `IsAnyBuildersClubMember`
- _optional_ jar: CookieJar,
- _optional_ success: function,
  - `option [string]` _or_ all options [object]
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### getRankInGroup(player, group[, success, failure, always])
Gets the rank of `player` in group `group`.

options [object]:
- player: number
- group: number
- _optional_ success: function,
  - `rank [number]`
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### getRolesetInGroup(player, group[, success, failure, always])
Gets the roleset ID of `player` in group `group`.

options [object]:
- player: number
- group: number
- _optional_ success: function,
  - `roleset [number]`
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### getRolesetInGroupWithJar(group[, jar, success, failure, always])
Gets the roleset ID of player logged into `jar` in group `group`.

options [object]:
- group: number
- _optional_ jar: CookieJar
- _optional_ success: function,
  - `roleset [number]`
- _optional_ failure: function,
  - `error [string]`
- _optional_ always _or_ callback: function

### getSession([jar])
Returns the .ROBLOSECURITY cookie extracted from `jar` if it exists.

options [object]:
- _optional_ jar: CookieJar

### getJar()
Returns the global cookie jar in use by the module.

### setJar(jar)
Sets the global cookie jar for the module to use.

- jar: CookieJar

### getInputs(html[, find])
Returns verification inputs on the page with the names in find - or all inputs if not provided. Typically used for ROBLOX requests working with ASP.NET.

options [object]:
- html: string
- _optional_ find: array

### getVerificationInputs(html)
Short for `getInputs(html,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION]')`. Typically used for ROBLOX requests working with ASP.NET.

options [object]:
- html: string
