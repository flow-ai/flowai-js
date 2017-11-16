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
} = require("../lib")

// Create a new live client
const client = new LiveClient('YOUR CLIENT ID HERE')

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
} = require("../lib")

const client = new LiveClient('YOUR CLIENT ID HERE')

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

client.on(LiveClient.MESSAGE_DELIVERED, (message) => {
  // The message we have send has been delivered
  // check the traceId to see what message has been
  // delivered since it's an async method
})

client.on(LiveClient.REPLY_RECEIVED, (message) => {
  // Called when a bot or human operator
  // sends a message or reply
  if(message.threadId === 'john') {
    // Incoming message for John
  } else {
    // Incoming message for another user
  }
})

client.on(LiveClient.ERROR, (err) => {
  // This handler will be fired whenever an error
  // occurs during the connection
  console.error('Something bad happened', err)
})

client.on(LiveClient.DISCONNECTED, () => {
  // The client has been disconnected
})

client.on(LiveClient.MESSAGE_SEND, (message) => {
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
A threadId is a unique token representing a channel, room, or user. If you have a single connection running for multiple clients, all using the same threadId, they will all receive the same message. It's important to note that sessionId completely disregared.

![Unique sessionIds](/media/unique-sessionid.png)

### sessionId
The sessionId is mostly useful for connecting multiple clients. Each connection is partly identified on our end using this key. Use the threadId to identify messages that belong to a certain user or chat room.

![Unique sessions and threadids](/media/unique-sessionid-threadid.png)

# API Reference
## Classes

<dl>
<dt><a href="#Attachment">Attachment</a></dt>
<dd><p>Base class to all attachments</p>
</dd>
<dt><a href="#Attachment">Attachment</a></dt>
<dd></dd>
<dt><a href="#EventAttachment">EventAttachment</a></dt>
<dd><p>Event attachment</p>
</dd>
<dt><a href="#EventAttachment">EventAttachment</a></dt>
<dd></dd>
<dt><a href="#Exception">Exception</a></dt>
<dd><p>Exception</p>
</dd>
<dt><a href="#LiveClient">LiveClient</a></dt>
<dd><p>Live streaming websocket client extends EventEmitter</p>
</dd>
<dt><a href="#Message">Message</a></dt>
<dd><p>Message being send to Flow.ai</p>
</dd>
<dt><a href="#Metadata">Metadata</a></dt>
<dd><p>Additional Message data</p>
</dd>
<dt><a href="#Originator">Originator</a></dt>
<dd><p>Originator of a Message</p>
</dd>
<dt><a href="#Reply">Reply</a></dt>
<dd><p>Reply being returned by Flow.ai</p>
</dd>
</dl>

<a name="Attachment"></a>

## Attachment
Base class to all attachments

**Kind**: global class  
<a name="new_Attachment_new"></a>

### new Attachment()
Constructor

<a name="Attachment"></a>

## Attachment
**Kind**: global class  
<a name="new_Attachment_new"></a>

### new Attachment()
Constructor

<a name="EventAttachment"></a>

## EventAttachment
Event attachment

**Kind**: global class  
<a name="new_EventAttachment_new"></a>

### new EventAttachment()
Constructor

<a name="EventAttachment"></a>

## EventAttachment
**Kind**: global class  
<a name="new_EventAttachment_new"></a>

### new EventAttachment()
Constructor

<a name="Exception"></a>

## Exception
Exception

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Human friendly message |
| type | <code>string</code> | Kind of error |
| innerException | <code>[Exception](#Exception)</code> | Inner exception |

<a name="new_Exception_new"></a>

### new Exception(message, type, innerException)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | message - Human friendly message |
| type | <code>string</code> | Kind of error |
| innerException | <code>[Exception](#Exception)</code> | Optional inner exception |

<a name="LiveClient"></a>

## LiveClient
Live streaming websocket client extends EventEmitter

**Kind**: global class  

* [LiveClient](#LiveClient)
    * [new LiveClient(clientId, endpoint)](#new_LiveClient_new)
    * _instance_
        * [.sessionId](#LiveClient+sessionId) ⇒ <code>string</code> &#124; <code>null</code>
        * [.threadId](#LiveClient+threadId) ⇒ <code>string</code> &#124; <code>null</code>
        * [.isConnected](#LiveClient+isConnected) ⇒ <code>bool</code>
        * [.start(threadId, sessionId)](#LiveClient+start)
        * [.stop()](#LiveClient+stop)
        * [.destroy()](#LiveClient+destroy)
        * [.send(message)](#LiveClient+send) ⇒
        * [.merger(mergerKey, threadId, sessionId)](#LiveClient+merger)
        * [.history(threadId)](#LiveClient+history)
        * [.noticed(threadId, instantly)](#LiveClient+noticed)
        * [.checkUnnoticed(threadId)](#LiveClient+checkUnnoticed)
    * _static_
        * [.ERROR](#LiveClient.ERROR) : <code>string</code>
        * [.CONNECTED](#LiveClient.CONNECTED) : <code>string</code>
        * [.RECONNECTING](#LiveClient.RECONNECTING) : <code>string</code>
        * [.DISCONNECTED](#LiveClient.DISCONNECTED) : <code>string</code>
        * [.REPLY_RECEIVED](#LiveClient.REPLY_RECEIVED) : <code>string</code>
        * [.MESSAGE_SEND](#LiveClient.MESSAGE_SEND) : <code>string</code>
        * [.MESSAGE_DELIVERED](#LiveClient.MESSAGE_DELIVERED) : <code>string</code>
        * [.REQUESTING_HISTORY](#LiveClient.REQUESTING_HISTORY) : <code>string</code>
        * [.NO_HISTORY](#LiveClient.NO_HISTORY) : <code>string</code>
        * [.RECEIVED_HISTORY](#LiveClient.RECEIVED_HISTORY) : <code>string</code>
        * [.CHECKED_UNNOTICED_MESSAGES](#LiveClient.CHECKED_UNNOTICED_MESSAGES) : <code>string</code>

<a name="new_LiveClient_new"></a>

### new LiveClient(clientId, endpoint)
Constructor


| Param | Type | Description |
| --- | --- | --- |
| clientId | <code>string</code> | Client token |
| endpoint | <code>string</code> | For testing purposes |

<a name="LiveClient+sessionId"></a>

### liveClient.sessionId ⇒ <code>string</code> &#124; <code>null</code>
Session Id of the connection

**Kind**: instance property of <code>[LiveClient](#LiveClient)</code>  
**Returns**: <code>string</code> &#124; <code>null</code> - Null if no connection is active  
<a name="LiveClient+threadId"></a>

### liveClient.threadId ⇒ <code>string</code> &#124; <code>null</code>
Default Thread Id to be used for any messages being send

**Kind**: instance property of <code>[LiveClient](#LiveClient)</code>  
**Returns**: <code>string</code> &#124; <code>null</code> - Null if no connection is active  
<a name="LiveClient+isConnected"></a>

### liveClient.isConnected ⇒ <code>bool</code>
Check if the connection is active

**Kind**: instance property of <code>[LiveClient](#LiveClient)</code>  
**Returns**: <code>bool</code> - True if the connection is active  
<a name="LiveClient+start"></a>

### liveClient.start(threadId, sessionId)
Start the client

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. When assigned, this is the default threadId for all messages that are send |
| sessionId | <code>string</code> | Optional. Must be unique for every connection |

<a name="LiveClient+stop"></a>

### liveClient.stop()
Use this method to temp disconnect a client

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient+destroy"></a>

### liveClient.destroy()
Close the connection and completely reset the client

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient+send"></a>

### liveClient.send(message) ⇒
This method triggers a `LiveClient.MESSAGE_SEND` event

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  
**Returns**: Message - Message that was send  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>[Message](#Message)</code> | Message to be send |

<a name="LiveClient+merger"></a>

### liveClient.merger(mergerKey, threadId, sessionId)
Merge two threads from different channels.
This methods is not yet publicy supported since we don't have a way yet to provide a mergerKey.

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  

| Param | Type | Description |
| --- | --- | --- |
| mergerKey | <code>string</code> | Unique token representing merge Request |
| threadId | <code>string</code> | Optional. The threadId to merge |
| sessionId | <code>string</code> | Optional. The sessionId to assign to the thread |

<a name="LiveClient+history"></a>

### liveClient.history(threadId)
Request historic messages

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. Specify the thread to retreive historic messages |

<a name="LiveClient+noticed"></a>

### liveClient.noticed(threadId, instantly)
Call to mark a thread as noticed.
The library automatically throttles the number of calls

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  

| Param | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Optional. Specify the thread that is noticed |
| instantly | <code>bool</code> | Optional. Instantly send notice. Default is false |

<a name="LiveClient+checkUnnoticed"></a>

### liveClient.checkUnnoticed(threadId)
Did we miss any messages?

**Kind**: instance method of <code>[LiveClient](#LiveClient)</code>  

| Param | Type |
| --- | --- |
| threadId | <code>string</code> | 

<a name="LiveClient.ERROR"></a>

### LiveClient.ERROR : <code>string</code>
Event that triggers when an error is received from the flow.ai platform

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.CONNECTED"></a>

### LiveClient.CONNECTED : <code>string</code>
Event that triggers when client is connected with platform

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.RECONNECTING"></a>

### LiveClient.RECONNECTING : <code>string</code>
Event that triggers when client tries to reconnect

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.DISCONNECTED"></a>

### LiveClient.DISCONNECTED : <code>string</code>
Event that triggers when the client gets disconnected

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.REPLY_RECEIVED"></a>

### LiveClient.REPLY_RECEIVED : <code>string</code>
Event that triggers when a new message is received from the platform

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.MESSAGE_SEND"></a>

### LiveClient.MESSAGE_SEND : <code>string</code>
Event that triggers when the client is sending a message to the platform

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.MESSAGE_DELIVERED"></a>

### LiveClient.MESSAGE_DELIVERED : <code>string</code>
Event that triggers when the send message has been received by the platform

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.REQUESTING_HISTORY"></a>

### LiveClient.REQUESTING_HISTORY : <code>string</code>
Event that triggers when a request is made to load historic messages

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.NO_HISTORY"></a>

### LiveClient.NO_HISTORY : <code>string</code>
Event that triggers when a request is made to load historic messages

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.RECEIVED_HISTORY"></a>

### LiveClient.RECEIVED_HISTORY : <code>string</code>
Event that triggers when historic messages are received

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="LiveClient.CHECKED_UNNOTICED_MESSAGES"></a>

### LiveClient.CHECKED_UNNOTICED_MESSAGES : <code>string</code>
Event that triggers when there are unnoticed messages

**Kind**: static constant of <code>[LiveClient](#LiveClient)</code>  
<a name="Message"></a>

## Message
Message being send to Flow.ai

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| speech | <code>string</code> | Text representing the Message |
| sender | <code>[Originator](#Originator)</code> | Originator |
| meta | <code>[Metadata](#Metadata)</code> | Meta data |
| attachment | <code>[Attachment](#Attachment)</code> | Optional attachment |


* [Message](#Message)
    * [new Message()](#new_Message_new)
    * [.build()](#Message.build)

<a name="new_Message_new"></a>

### new Message()
Constructor


| Param | Type | Description |
| --- | --- | --- |
| options.traceId | <code>int</code> | Optional unique integer you can match messages with |
| options.threadId | <code>string</code> | Optional unique id specific to this chat |
| options.speech | <code>string</code> | Text representing the Message |
| options.originator | <code>[Originator](#Originator)</code> | Originator |
| options.metadata | <code>object</code> | Meta data |
| options.attachment | <code>object</code> | Attachment (optional) |

<a name="Message.build"></a>

### Message.build()
Factory method

**Kind**: static method of <code>[Message](#Message)</code>  
<a name="Metadata"></a>

## Metadata
Additional Message data

**Kind**: global class  
<a name="new_Metadata_new"></a>

### new Metadata()
Constructor

<a name="Originator"></a>

## Originator
Originator of a Message

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of a person or system originating the Message |
| profile.fullName | <code>string</code> | First and surname of person |
| profile.firstName | <code>string</code> | First name of the person |
| profile.lastName | <code>string</code> | Last name of the person |
| profile.picture | <code>string</code> | Profile picture (url) |
| profile.locale | <code>string</code> | ISO code describing language and country (en-US) |
| profile.gender | <code>string</code> | M for male, F for female or U for unknown / other |

<a name="Reply"></a>

## Reply
Reply being returned by Flow.ai

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| threadId | <code>string</code> | Unique id specific to this chat |
| originator | <code>[Originator](#Originator)</code> | Originator |
| messages | <code>Array</code> | List of messages |
| messages[].fallback | <code>string</code> | Textual representation of any responses |
| messages[].replyTo | <code>string</code> | Optional replying to query |
| messages[].contexts | <code>array</code> | Optional List of context names |
| messages[].params | <code>array</code> | Optional key value pair of parameters |
| messages[].intents | <code>array</code> | Optional list of intent names determined |
| messages[].responses | <code>Array</code> | List of response templates |
| messages[].responses[].type | <code>Array</code> | Template type |
| messages[].responses[].payload | <code>Array</code> | Template payload |
| messages[].responses[].delay | <code>Array</code> | Number of seconds the response is delayed |

<a name="new_Reply_new"></a>

### new Reply()
Constructor

