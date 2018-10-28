# The flow.ai Javascript SDK
Access the [flow.ai](https://flow.ai) platform from your Node.js or javascript app. This library lets you build on the flow.ai Webclient API.

## What can you do?

*	A simple way to connect with [flow.ai](https://flow.ai)
* Auto reconnect and event binding
*	Send and receive messages
*	Trigger actions and interact with AI bots

## Usage

### Installation
Run `npm install --save flowai-js`

### Simple Node.js example

```js
const {
  LiveClient,
  Message,
  Originator
} = require("flowai-js")

// Create a new live client
const client = new LiveClient({
  clientId: 'YOUR CLIENT ID HERE',
  origin: 'https://my.site'
})

// Fired whenever the client connects
client.on(LiveClient.CONNECTED, () => {

  console.log('--> Connected')

  // Create the originator of the message
  const originator = new Originator({
    name: "Boss"
  })

  // Create a Message
  const message = new Message({
    // Thread Id limits the message just to John
    threadId: 'john',
    // The text to send
    speech: "Behold, I'm pure awesomeness!",
    // Person or system sending the message
    originator
  })

  // Send
  client.send(message)
})

// Start the connection
client.start()
```

### Advanced Node.js example
In this example you'll notice all events that are available

```js
const {
  LiveClient,
  Message,
  Originator
} = require("flowai-js")

// Create a new live client
const client = new LiveClient({
  // Unique clientId copy & paste from Flow.ai dashboard
  clientId: 'YOUR CLIENT ID HERE',

  // When limiting to whitelisted domains, specify this
  origin: 'https://my.site'
})

client.on(LiveClient.CONNECTED, () => {
  const originator = new Originator({
    name: "Boss"
  })

  const message = new Message({
    // Thread Id limits the message just to John
    threadId: 'john',
    // Use the traceId to identify message
    // being marked as delivered
    traceId: 1,
    speech: "Behold, I'm pure awesomeness!",
    originator
  })

  client.send(message)
})

client.on(LiveClient.MESSAGE_DELIVERED, message => {
  // The message we have send has been delivered
  // check the traceId to see what message has been
  // delivered since it's an async method
})

client.on(LiveClient.REPLY_RECEIVED, message => {
  // Called when a bot or human operator
  // sends a message or reply
  if(message.threadId === 'john') {
    // Incoming message for John
  } else {
    // Incoming message for another user
  }
})

client.on(LiveClient.ERROR, err => {
  // This handler will be fired whenever an error
  // occurs during the connection
  console.error('Something bad happened', err)
})

client.on(LiveClient.DISCONNECTED, () => {
  // The client has been disconnected
})

client.on(LiveClient.MESSAGE_SEND, message => {
  // Called whenever the client sends a message
})

client.on(LiveClient.RECONNECTING, () => {
  // Called when the client tries to reconnect
})

client.start()
```

### Simple browser example
Using the library within the browser is pretty much the same as the Node.js examples.

There is one notable difference, all classes live inside a `Flowai` object.

#### Include the script
```html
<script src="flowai-js.min.js"></script>
```

#### Usage

```js
var client = new Flowai.LiveClient('YOUR CLIENT ID HERE');
client.on(LiveClient.CONNECTED, function(){
  var originator = new Flowai.Originator({ fullName: "John Doo" });

  var message = new Flowai.Message({
    threadId: 'john',
    traceId: 1,
    speech: "Behold, I'm pure awesomeness!",
    originator
  });

  client.send(message);
})

client.start();
```

### Notes on using with webpack
The library can be easily used with webpack. You'll probably receive an error though involving `fs`.

Add the following to your webpack config file:
```
node: {
  fs: 'empty'
},
```

## Identifying messages
The SDK is pretty flexible with regard to how messages are delivered and grouped. To do this we use two unique keys: sessionId and threadId.

![ThreadId](/media/unique-threadid.png)

### threadId
A threadId is a unique key representing a channel, room, or user. If you have a single connection running for multiple clients, all using the same threadId, they will all receive the same messages.

![Unique sessionIds](/media/unique-sessionid.png)

### sessionId
The sessionId is used to identify connections from different devices like browsers or Node.js servers. Each connection is partly identified on our end using this key.

![Unique sessions and threadids](/media/unique-sessionid-threadid.png)

# Full API Reference
## Classes

<dl>
<dt><a href="#EventAttachment">EventAttachment</a></dt>
<dd><p>Trigger events</p>
</dd>
<dt><a href="#Exception">Exception</a></dt>
<dd><p>Exception</p>
</dd>
<dt><a href="#FileAttachment">FileAttachment</a></dt>
<dd><p>Send a file as attachment</p>
</dd>
<dt><a href="#LiveClient">LiveClient</a></dt>
<dd><p>Live streaming websocket client extends EventEmitter</p>
</dd>
<dt><a href="#Message">Message</a></dt>
<dd></dd>
<dt><a href="#Metadata">Metadata</a></dt>
<dd><p>Additional Message data</p>
</dd>
<dt><a href="#Originator">Originator</a></dt>
<dd><p>Originator of a Message</p>
</dd>
<dt><a href="#Reply">Reply</a></dt>
<dd><p>Reply you receive from Flow.ai</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#build">build</a></dt>
<dd><p>Message you send to Flow.ai</p>
</dd>
</dl>

<a name="EventAttachment"></a>

## EventAttachment
Trigger events

<a name="new_EventAttachment_new"></a>

### new EventAttachment(name, [label])

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the event to trigger |
| [label] | <code>string</code> | Optional human readable label for the triggered event |

Constructor

**Example**  
```js
// Event without any label
const message = new Message({
  attachment: new EventAttachment('BUY')
})
```
**Example**  
```js
// Event with label to display user
const message = new Message({
  attachment: new EventAttachment('BUY', 'Buy dress')
})
```
<a name="Exception"></a>

## Exception
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Human friendly message |
| type | <code>string</code> | Kind of error |
| innerException | [<code>Exception</code>](#Exception) | Inner exception |
| isFinal | <code>boolean</code> | Prevent further execution |

Exception

<a name="new_Exception_new"></a>

### new Exception(message, type, innerException, isFinal)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | message - Human friendly message |
| type | <code>string</code> |  | Kind of error |
| innerException | [<code>Exception</code>](#Exception) |  | Optional inner exception |
| isFinal | <code>boolean</code> | <code>false</code> | Indicates if this exception prevents further execution |

Constructor

<a name="FileAttachment"></a>

## FileAttachment
Send a file as attachment

<a name="new_FileAttachment_new"></a>

### new FileAttachment(data)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>File</code> \| <code>ReadStream</code> | File or Blob in the browser, ReadStream in Nodejs |

Constructor

**Example**  
```js
// Web example

var originator = new Originator({
  name: 'Jane'
})

var file = fileInputElement.files[0]

const message = new Message({
  attachment: new FileAttachment(file)
})

client.send(message)
```
**Example**  
```js
// Nodejs example
import { createReadStream } from 'fs'

const originator = new Originator({
  name: 'Jane'
})

// Load ReadStream from file on disk
const data = fs.createReadStream('/foo/bar.jpg')

const message = new Message({
  attachment: new FileAttachment(data)
})

client.send(message)
```
<a name="LiveClient"></a>

## LiveClient
Live streaming websocket client extends EventEmitter


* [LiveClient](#LiveClient)

    * [new LiveClient(opts)](#new_LiveClient_new)

    * _instance_
        * [.sessionId](#LiveClient+sessionId)

        * [.threadId](#LiveClient+threadId)

        * [.threadId](#LiveClient+threadId)

        * [.isConnected](#LiveClient+isConnected)

        * [.sessionId()](#LiveClient+sessionId)

        * [.start(threadId, sessionId)](#LiveClient+start)

        * [.stop()](#LiveClient+stop)

        * [.destroy()](#LiveClient+destroy)

        * [.send(message)](#LiveClient+send)

        * [.merger(mergerKey, threadId, sessionId)](#LiveClient+merger)

        * [.history(threadId)](#LiveClient+history)

        * [.noticed(threadId, instantly)](#LiveClient+noticed)

        * [.checkUnnoticed(threadId)](#LiveClient+checkUnnoticed)

    * _static_
        * [.ERROR](#LiveClient.ERROR)

        * [.CONNECTED](#LiveClient.CONNECTED)

        * [.RECONNECTING](#LiveClient.RECONNECTING)

        * [.DISCONNECTED](#LiveClient.DISCONNECTED)

        * [.REPLY_RECEIVED](#LiveClient.REPLY_RECEIVED)

        * [.MESSAGE_SEND](#LiveClient.MESSAGE_SEND)

        * [.MESSAGE_DELIVERED](#LiveClient.MESSAGE_DELIVERED)

        * [.REQUESTING_HISTORY](#LiveClient.REQUESTING_HISTORY)

        * [.NO_HISTORY](#LiveClient.NO_HISTORY)

        * [.RECEIVED_HISTORY](#LiveClient.RECEIVED_HISTORY)

        * [.CHECKED_UNNOTICED_MESSAGES](#LiveClient.CHECKED_UNNOTICED_MESSAGES)


<a name="new_LiveClient_new"></a>

### new LiveClient(opts)

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> \| <code>string</code> | Configuration options or shorthand for just clientId |
| opts.clientId | <code>string</code> | Mandatory Client token |
| opts.storage | <code>string</code> | Optional, 'session' for using sessionStorage, 'local' for localStorage or `memory` for a simple memory store |
| opts.endpoint | <code>string</code> | Optional, only for testing purposes |
| opts.origin | <code>string</code> | When running on Nodejs you MUST set the origin |

Constructor

**Example**  
```js
// Node.js
const client = new LiveClient({
  clientId: 'MY CLIENT ID',
  origin: 'https://my.website'
})

// Web
const client = new LiveClient({
  clientId: 'MY CLIENT ID',
  storage: 'session'
})

// Lambda function
const client = new LiveClient({
  clientId: 'MY CLIENT ID',
  storage: 'memory'
})
```
<a name="LiveClient+sessionId"></a>

### *liveClient*.sessionId

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Change the session ID |

Session Id of the connection

<a name="LiveClient+threadId"></a>

### *liveClient*.threadId
Default Thread Id to be used for any messages being send

**Returns**: <code>string</code> - Null if no connection is active  
<a name="LiveClient+threadId"></a>

### *liveClient*.threadId

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Change the thread ID |

Session Id of the connection

<a name="LiveClient+isConnected"></a>

### *liveClient*.isConnected
Check if the connection is active

**Returns**: <code>boolean</code> - True if the connection is active  
**Example**  
```js
if(client.isConnected) {
  // Do something awesome
}
```
<a name="LiveClient+sessionId"></a>

### *liveClient*.sessionId()
Session Id of the connection

**Returns**: <code>string</code> - Null if no connection is active  
<a name="LiveClient+start"></a>

### *liveClient*.start(threadId, sessionId)

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. When assigned, this is the default threadId for all messages that are send |
| sessionId | <code>string</code> | Optional. Must be unique for every connection |

Start the client

**Example**  
```js
// Start, will generate thread and sessionId
client.start()
```
**Example**  
```js
// Start with your own custom threadId
client.start('UNIQUE THREADID FOR USER')
```
<a name="LiveClient+stop"></a>

### *liveClient*.stop()
Use this method to temp disconnect a client

**Example**  
```js
// Close the connection
client.stop()
```
<a name="LiveClient+destroy"></a>

### *liveClient*.destroy()
Close the connection and completely reset the client

**Example**  
```js
// Close the connection and reset the client
client.destroy()
```
<a name="LiveClient+send"></a>

### *liveClient*.send(message)

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | Message you want to send |

This method triggers a `LiveClient.MESSAGE_SEND` event

**Returns**: <code>object</code> - Message that was send  
**Example**  
```js
const originator = new Originator({
  name: "Jane"
})

const message = new Message({
 speech: "Hi!",
 originator
})

client.send(message)
```
<a name="LiveClient+merger"></a>

### *liveClient*.merger(mergerKey, threadId, sessionId)

| Param | Type | Description |
| --- | --- | --- |
| mergerKey | <code>string</code> | Unique token representing merge Request |
| threadId | <code>string</code> | Optional. The threadId to merge |
| sessionId | <code>string</code> | Optional. The sessionId to assign to the thread |

Merge two threads from different channels.
This methods is not yet publicy supported since we don't have a way yet to provide a mergerKey.

<a name="LiveClient+history"></a>

### *liveClient*.history(threadId)

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. Specify the threadId to retreive historic messages |

Request historic messages

**Example**  
```js
// Load any messages if there is a threadId
// usefull when using with JS in the browser
client.history()

// Load messages using a custom threadId
client.history('MY CUSTOM THREAD ID')
```
<a name="LiveClient+noticed"></a>

### *liveClient*.noticed(threadId, instantly)

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. Specify the thread that is noticed |
| instantly | <code>boolean</code> | Optional. Instantly send notice. Default is false |

Call to mark a thread as noticed.
The library automatically throttles the number of calls

**Example**  
```js
// Call that the client has seen all messages for the auto clientId
client.noticed()

// Mark messages based on a custom threadId
client.noticed('MY CUSTOM THREAD ID')
```
<a name="LiveClient+checkUnnoticed"></a>

### *liveClient*.checkUnnoticed(threadId)

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. Specify the thread to check unnoticed messags for |

Did we miss any messages?

<a name="LiveClient.ERROR"></a>

### *LiveClient*.ERROR
Event that triggers when an error is received from the flow.ai platform

<a name="LiveClient.CONNECTED"></a>

### *LiveClient*.CONNECTED
Event that triggers when client is connected with platform

<a name="LiveClient.RECONNECTING"></a>

### *LiveClient*.RECONNECTING
Event that triggers when client tries to reconnect

<a name="LiveClient.DISCONNECTED"></a>

### *LiveClient*.DISCONNECTED
Event that triggers when the client gets disconnected

<a name="LiveClient.REPLY_RECEIVED"></a>

### *LiveClient*.REPLY_RECEIVED
Event that triggers when a new message is received from the platform

<a name="LiveClient.MESSAGE_SEND"></a>

### *LiveClient*.MESSAGE_SEND
Event that triggers when the client is sending a message to the platform

<a name="LiveClient.MESSAGE_DELIVERED"></a>

### *LiveClient*.MESSAGE_DELIVERED
Event that triggers when the send message has been received by the platform

<a name="LiveClient.REQUESTING_HISTORY"></a>

### *LiveClient*.REQUESTING_HISTORY
Event that triggers when a request is made to load historic messages

<a name="LiveClient.NO_HISTORY"></a>

### *LiveClient*.NO_HISTORY
Event that triggers when a request is made to load historic messages

<a name="LiveClient.RECEIVED_HISTORY"></a>

### *LiveClient*.RECEIVED_HISTORY
Event that triggers when historic messages are received

<a name="LiveClient.CHECKED_UNNOTICED_MESSAGES"></a>

### *LiveClient*.CHECKED_UNNOTICED_MESSAGES
Event that triggers when there are unnoticed messages

<a name="Message"></a>

## Message

* [Message](#Message)

    * [new Message(opts)](#new_Message_new)

    * [.build(opts)](#Message.build)


<a name="new_Message_new"></a>

### new Message(opts)

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> |  |
| opts.traceId | <code>number</code> | Optional unique integer you can match messages with |
| opts.threadId | <code>string</code> | Optional unique id specific to this chat |
| opts.speech | <code>string</code> | Text representing the Message |
| opts.originator | [<code>Originator</code>](#Originator) | Originator |
| opts.metadata | [<code>Metadata</code>](#Metadata) | Meta data |
| opts.attachment | [<code>Attachment</code>](#new_Attachment_new) | Attachment (optional) |

Constructor

<a name="Message.build"></a>

### *Message*.build(opts)

| Param | Type |
| --- | --- |
| opts | <code>object</code> | 
| opts.threadId | <code>string</code> | 
| opts.traceId | <code>string</code> | 
| opts.speech | <code>string</code> | 
| opts.originator | <code>object</code> | 
| opts.metadata | <code>object</code> | 
| opts.attachment | <code>object</code> | 

Factory method

<a name="Metadata"></a>

## Metadata
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| language | <code>string</code> | Language the message is ib |
| timezone | <code>number</code> | UTC time offset in hours |
| params | <code>Object</code> | Parameters to send with the message |
| domain | <code>Object</code> | Browser or server environment variables like origin |

Additional Message data


* [Metadata](#Metadata)

    * [new Metadata(language, timezone, params)](#new_Metadata_new)

    * _instance_
        * ~~[.addContext()](#Metadata+addContext)
~~
    * _static_
        * [.build(metadata)](#Metadata.build)


<a name="new_Metadata_new"></a>

### new Metadata(language, timezone, params)

| Param | Type | Description |
| --- | --- | --- |
| language | <code>string</code> | Specify the language of the message |
| timezone | <code>number</code> | Specify the timezone of the message |
| params | <code>Object</code> | Additional data to be send |

Constructor

<a name="Metadata+addContext"></a>

### ~~*metadata*.addContext()~~
***Deprecated***

<a name="Metadata.build"></a>

### *Metadata*.build(metadata)

| Param | Type |
| --- | --- |
| metadata | <code>Object</code> | 

Create a Metadata object from raw data

<a name="Originator"></a>

## Originator
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a person or system originating the Message, default is Anonymous |
| role | <code>string</code> | The role of the person. You cannot set this, default is external |
| profile | <code>Object</code> | Contains profile info |
| profile.fullName | <code>string</code> | First and surname combined |
| profile.firstName | <code>string</code> | First name of the person |
| profile.lastName | <code>string</code> | Last name of the person |
| profile.email | <code>string</code> | E-mail address |
| profile.description | <code>string</code> | Description of this user |
| profile.picture | <code>string</code> | Profile picture (url) |
| profile.locale | <code>string</code> | ISO code describing language and country (en-US) |
| profile.timezone | <code>number</code> | Hours from GMT |
| profile.location | <code>string</code> | Location of the user |
| profile.gender | <code>string</code> | M for male, F for female or U for unknown / other |
| metadata | <code>object</code> | Optional object with custom metadata |

Originator of a Message

<a name="new_Originator_new"></a>

### new Originator(opts)

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> |  |
| opts.name | <code>string</code> | Name of a person or system originating the Message, default is Anonymous |
| opts.role | <code>string</code> | The role of the person. You cannot set this, default is external |
| opts.profile | <code>Object</code> | Contains profile info |
| opts.profile.fullName | <code>string</code> | First and surname combined |
| opts.profile.firstName | <code>string</code> | First name of the person |
| opts.profile.lastName | <code>string</code> | Last name of the person |
| opts.profile.email | <code>string</code> | E-mail address |
| opts.profile.description | <code>string</code> | Description of this user |
| opts.profile.picture | <code>string</code> | Profile picture (url) |
| opts.profile.locale | <code>string</code> | ISO code describing language and country (en-US) |
| opts.profile.timezone | <code>number</code> | Hours from GMT |
| opts.profile.location | <code>string</code> | Location of the user |
| opts.profile.gender | <code>string</code> | M for male, F for female or U for unknown / other |
| opts.metadata | <code>object</code> | Optional object with custom metadata |

<a name="Reply"></a>

## Reply
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Unique id specific to this chat |
| originator | [<code>Originator</code>](#Originator) | Originator |
| messages | <code>Array.&lt;ReplyMessage&gt;</code> | List of messages |
| messages[].fallback | <code>string</code> | Textual representation of any responses |
| messages[].replyTo | <code>string</code> | Optional replying to query |
| messages[].contexts | <code>array</code> | Optional List of context names |
| messages[].params | <code>array</code> | Optional key value pair of parameters |
| messages[].intents | <code>array</code> | Optional list of intent names determined |
| messages[].responses | <code>Array.&lt;Response&gt;</code> | List of response templates |
| messages[].responses[].type | <code>string</code> | Template type |
| messages[].responses[].payload | <code>Object</code> | Template payload |
| messages[].responses[].delay | <code>Number</code> | Number of seconds the response is delayed |

Reply you receive from Flow.ai

<a name="new_Reply_new"></a>

### new Reply()
Constructor

<a name="build"></a>

## build
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| speech | <code>string</code> | Text representing the Message |
| originator | [<code>Originator</code>](#Originator) | Originator |
| meta | [<code>Metadata</code>](#Metadata) | Meta data |
| attachment | [<code>Attachment</code>](#new_Attachment_new) | Optional attachment |

Message you send to Flow.ai

