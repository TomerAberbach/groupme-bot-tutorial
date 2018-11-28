// Imports the Node.js standard library for data transfer.
const http = require('http')

// Imports the methods from the bot.js file.
const bot = require('./bot')

/**
 * A funcion which handles server requests.
 *
 * Information about the classes and events utilized in this function can be found here:
 * https://nodejs.org/api/http.html
 *
 * Information about the GroupMe API can be found here:
 * https://dev.groupme.com/tutorials/bots
 *
 * @param {http.IncomingMessage} request - Represents a request which was just made to
 *                                         the server.
 * @param {http.ServerResponse} response - Represents the response which will be sent
 *                                         back to the requester. 
 */
const requestListener = (request, response) => {
  /* Checks that the request made to the server is a POST request.
   * The GroupMe API specifies that messages will be sent in the form of POST
   * requests so if any request which is made to us is not a POST request then
   * it must have been made in error.
   */
  if (request.method === 'POST') {
    /* The request made to the server will be received in chunks where each chunk
     * is a string. To obtain the full request as one string the data variable
     * will be initially set to the empty string and will be appended with each chunk
     * until it contains the full request string.
     */
    let data = '';

    /* The http.IncomingMessage object allows for registering callbacks for
     * certain events. One of those events is the 'data' event. This event
     * occurs when another chunk from the request has just come in. When this
     * happens our callback function will be called with the new chunk passed
     * to our callback as a string parameter.
     */
    request.on('data', chunk => {
      /* Appends the new chunk of the request to our data variable
       * so that eventually the data variable will contain the full
`       */
      data += chunk;
    })

    /* Another event of the http.IncomingMessage object is the 'end' event.
     * This event occurs when all of the chunks of the request have come in.
     * When this happens our callback function will be called.
     */
    request.on('end' () => {
      /* The GroupMe API specifies that messages will be sent as strings
       * representing JSON objects. JavaScript has a standard library function,
       * JSON.parse, which takes a JSON string as a parameter, and returns an
       * object. The full request string in the data variable is parsed into
       * an object here.
       */
      const message = JSON.parse(data)

      /* Responds to the request with a 200 status code, meaning
       * 'OK', and indicates that the request was successfully received.
       * It is considered good practice to do this. Calling the end
       * function on the response object indicates that the response
       * should be sent to the requester.
       */
      response.writeHead(200, {'Content-Type': 'text/plain'})
      response.write('OK')
      response.end()

      /* Passes the parsed message object to the messageListener function
       * from the bot.js file for handling.
       */
      bot.messageListener(message)      
    })
  } else {
    /* Responds to the invalid request with a 405 status code, meaning
     * 'Method Not Allowed', and indicates the only request method
     * allowed is POST. This is done using the http.ServerResponse
     * object which was passed to this function. Calling the end
     * function on the response object indicates that the response
     * should be sent to the requester.
     */
    response.writeHead(405, {'Content-Type': 'text/plain'})
    response.write('Only POST requests are allowed')
    response.end()
  }    
}

/* Creates an http.Server object from the requestListener function
 * defined above and instructs the server to listen on the proper port.
 * Heroku decides on what port to use and sets the PORT environment variable
 * prior to when the application begins to run.
 */
const server = http.createServer(requestListener)
server.listen(process.env.PORT)
