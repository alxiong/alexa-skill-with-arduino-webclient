# Arduino WebClient

## Minimum Barebones of a Web Client
- Able to send a HTTP request with customized header and body where parameters are contained.
- Able to parse HTTP response which is normally in JSON format, more specifically by stripping out the headers and read any key-value pair in the body.

## Testing
Grab all code from [`arduinoWebClient.ino`](./src/arduinoWebClient.ino), paste it into your arduino editor, you should be able to see: every 10 seconds, Arduino initiates a `?action=arduinoPull` API call and received the status; if the `toMove` field in the HTTP response is `true`, then Arduino will send `?action=arduinoMove` to notify Web Server that queuing move is being executed and clear the pipeline. All log should be seen in your serial monitor.


<a href="./5-configure-cloudfront.md"><img src="./assets/prev_6.png" style="float:left; margin-bottom: 30px;"></img></a>
