// Imports a popular library for making HTTP requests.
const request = require('request')

/**
 * A function which sends a GroupMe message as this bot to the bot's group.
 *
 * Information about the request library can be found here:
 * https://github.com/request/request
 *
 * Information about the GroupMe API can be found here:
 * https://dev.groupme.com/tutorials/bots
 *
 * @param {string} text - Represents the message text which should be sent
 *                        as this bot to the bot's group.
 */
const sendMessage = text => {
  /* The GroupMe API specifies that messages should be sent to
   * the https://api.groupme.com/v3/bots/post url as a POST request.
   *
   * The request should contain:
   * 1. A valid GroupMe access token as a query parameter like so:
   *    https://api.groupme.com/v3/bots/post?token=YOUR_ACCESS_TOKEN
   * 2. A JSON string in the body/payload of the POST request which should
   *    contain:
   *    i. A 'bot_id' attribute with a valid GroupMe bot ID as its value.
   *    ii. A 'text' attribute with the message text to be sent as its value.
   *
   * The code below accomplishes all of this using the object passed to the
   * request library method. Lastly, if the message could not be sent for
   * some reason then the response from the request is logged to the Heroku
   * console.
   */
  request({
    method: 'POST',
    url: 'https://api.groupme.com/v3/bots/post',
    qs: {
      token: process.env.ACCESS_TOKEN
    },
    body: {
      'bot_id': process.env.BOT_ID,
      'text': text
    },
    json: true
  }, (err, response) => {
    if (err != null) {
      console.log(response)
    }
  })
}

/**
 * A function which responds to a GroupMe message in the bot's group.
 *
 * A sample GroupMe message object from https://dev.groupme.com/tutorials/bots
 * is shown below:
 * {
 *   "attachments": [],
 *   "avatar_url": "https://i.groupme.com/123456789",
 *   "created_at": 1302623328,
 *   "group_id": "1234567890",
 *   "id": "1234567890",
 *   "name": "John",
 *   "sender_id": "12345",
 *   "sender_type": "user",
 *   "source_guid": "GUID",
 *   "system": false,
 *   "text": "Hello world",
 *   "user_id": "1234567890"
 *  } 
 *
 * @param [object] message - A GroupMe message object representing the message which 
 *                           was sent in the bot's group.
 */
const messageListener = message => {
  /* Checks that the sender of the message is a user.
   * This is done so that the bot does not respond to
   * itself.
   */
  if (message['sender_type'] === 'user') {
    // Checks if the sent message contained the string 'bot'.
    if (message['text'].indexOf('bot') !== -1) {
      /* Sends a GroupMe message as this bot to the bot's group,
       * indicating its insecurity about the topic of conversation.
       */
      sendMessage('OMG! Are you guys gossiping about me?!?!')
    }
  }
}

/* Exports the messageListener function as a function
 * which can be used outside of this bot.js file. The
 * exported function is used in the server.js file.
 */
module.exports.messageListener = messageListener
