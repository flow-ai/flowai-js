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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>string</code></td><td><p>Name of the event to trigger</p>
</td>
    </tr><tr>
    <td>[label]</td><td><code>string</code></td><td><p>Optional human readable label for the triggered event</p>
</td>
    </tr>  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td><td><p>Human friendly message</p>
</td>
    </tr><tr>
    <td>type</td><td><code>string</code></td><td><p>Kind of error</p>
</td>
    </tr><tr>
    <td>innerException</td><td><code><a href="#Exception">Exception</a></code></td><td><p>Inner exception</p>
</td>
    </tr><tr>
    <td>isFinal</td><td><code>boolean</code></td><td><p>Prevent further execution</p>
</td>
    </tr>  </tbody>
</table>

Exception

<a name="new_Exception_new"></a>

### new Exception(message, type, innerException, isFinal)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td><td></td><td><p>message - Human friendly message</p>
</td>
    </tr><tr>
    <td>type</td><td><code>string</code></td><td></td><td><p>Kind of error</p>
</td>
    </tr><tr>
    <td>innerException</td><td><code><a href="#Exception">Exception</a></code></td><td></td><td><p>Optional inner exception</p>
</td>
    </tr><tr>
    <td>isFinal</td><td><code>boolean</code></td><td><code>false</code></td><td><p>Indicates if this exception prevents further execution</p>
</td>
    </tr>  </tbody>
</table>

Constructor

<a name="FileAttachment"></a>

## FileAttachment
Send a file as attachment

<a name="new_FileAttachment_new"></a>

### new FileAttachment(data)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>data</td><td><code>File</code> | <code>ReadStream</code></td><td><p>File or Blob in the browser, ReadStream in Nodejs</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>opts</td><td><code>object</code> | <code>string</code></td><td><p>Configuration options or shorthand for just clientId</p>
</td>
    </tr><tr>
    <td>opts.clientId</td><td><code>string</code></td><td><p>Mandatory Client token</p>
</td>
    </tr><tr>
    <td>opts.storage</td><td><code>string</code></td><td><p>Optional, &#39;session&#39; for using sessionStorage, &#39;local&#39; for localStorage or <code>memory</code> for a simple memory store</p>
</td>
    </tr><tr>
    <td>opts.endpoint</td><td><code>string</code></td><td><p>Optional, only for testing purposes</p>
</td>
    </tr><tr>
    <td>opts.origin</td><td><code>string</code></td><td><p>When running on Nodejs you MUST set the origin</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>string</code></td><td><p>Change the session ID</p>
</td>
    </tr>  </tbody>
</table>

Session Id of the connection

<a name="LiveClient+threadId"></a>

### *liveClient*.threadId
Default Thread Id to be used for any messages being send

**Returns**: <code>string</code> - Null if no connection is active  
<a name="LiveClient+threadId"></a>

### *liveClient*.threadId
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>value</td><td><code>string</code></td><td><p>Change the thread ID</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>threadId</td><td><code>string</code></td><td><p>Optional. When assigned, this is the default threadId for all messages that are send</p>
</td>
    </tr><tr>
    <td>sessionId</td><td><code>string</code></td><td><p>Optional. Must be unique for every connection</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>object</code></td><td><p>Message you want to send</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>mergerKey</td><td><code>string</code></td><td><p>Unique token representing merge Request</p>
</td>
    </tr><tr>
    <td>threadId</td><td><code>string</code></td><td><p>Optional. The threadId to merge</p>
</td>
    </tr><tr>
    <td>sessionId</td><td><code>string</code></td><td><p>Optional. The sessionId to assign to the thread</p>
</td>
    </tr>  </tbody>
</table>

Merge two threads from different channels.
This methods is not yet publicy supported since we don't have a way yet to provide a mergerKey.

<a name="LiveClient+history"></a>

### *liveClient*.history(threadId)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>threadId</td><td><code>string</code></td><td><p>Optional. Specify the threadId to retreive historic messages</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>threadId</td><td><code>string</code></td><td><p>Optional. Specify the thread that is noticed</p>
</td>
    </tr><tr>
    <td>instantly</td><td><code>boolean</code></td><td><p>Optional. Instantly send notice. Default is false</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>threadId</td><td><code>string</code></td><td><p>Optional. Specify the thread to check unnoticed messags for</p>
</td>
    </tr>  </tbody>
</table>

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
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>opts</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>opts.traceId</td><td><code>number</code></td><td><p>Optional unique integer you can match messages with</p>
</td>
    </tr><tr>
    <td>opts.threadId</td><td><code>string</code></td><td><p>Optional unique id specific to this chat</p>
</td>
    </tr><tr>
    <td>opts.speech</td><td><code>string</code></td><td><p>Text representing the Message</p>
</td>
    </tr><tr>
    <td>opts.originator</td><td><code><a href="#Originator">Originator</a></code></td><td><p>Originator</p>
</td>
    </tr><tr>
    <td>opts.metadata</td><td><code><a href="#Metadata">Metadata</a></code></td><td><p>Meta data</p>
</td>
    </tr><tr>
    <td>opts.attachment</td><td><code><a href="#new_Attachment_new">Attachment</a></code></td><td><p>Attachment (optional)</p>
</td>
    </tr>  </tbody>
</table>

Constructor

<a name="Message.build"></a>

### *Message*.build(opts)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>opts</td><td><code>object</code></td>
    </tr><tr>
    <td>opts.threadId</td><td><code>string</code></td>
    </tr><tr>
    <td>opts.traceId</td><td><code>string</code></td>
    </tr><tr>
    <td>opts.speech</td><td><code>string</code></td>
    </tr><tr>
    <td>opts.originator</td><td><code>object</code></td>
    </tr><tr>
    <td>opts.metadata</td><td><code>object</code></td>
    </tr><tr>
    <td>opts.attachment</td><td><code>object</code></td>
    </tr>  </tbody>
</table>

Factory method

<a name="Metadata"></a>

## Metadata
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>language</td><td><code>string</code></td><td><p>Language the message is ib</p>
</td>
    </tr><tr>
    <td>timezone</td><td><code>number</code></td><td><p>UTC time offset in hours</p>
</td>
    </tr><tr>
    <td>params</td><td><code>Object</code></td><td><p>Parameters to send with the message</p>
</td>
    </tr><tr>
    <td>domain</td><td><code>Object</code></td><td><p>Browser or server environment variables like origin</p>
</td>
    </tr>  </tbody>
</table>

Additional Message data


* [Metadata](#Metadata)

    * [new Metadata(language, timezone, params)](#new_Metadata_new)

    * _instance_
        * <del>[.addContext()](#Metadata+addContext)
</del>
    * _static_
        * [.build(metadata)](#Metadata.build)


<a name="new_Metadata_new"></a>

### new Metadata(language, timezone, params)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>language</td><td><code>string</code></td><td><p>Specify the language of the message</p>
</td>
    </tr><tr>
    <td>timezone</td><td><code>number</code></td><td><p>Specify the timezone of the message</p>
</td>
    </tr><tr>
    <td>params</td><td><code>Object</code></td><td><p>Additional data to be send</p>
</td>
    </tr>  </tbody>
</table>

Constructor

<a name="Metadata+addContext"></a>

### <del>*metadata*.addContext()</del>
***Deprecated***

<a name="Metadata.build"></a>

### *Metadata*.build(metadata)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>metadata</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>

Create a Metadata object from raw data

<a name="Originator"></a>

## Originator
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>name</td><td><code>string</code></td><td><p>Name of a person or system originating the Message, default is Anonymous</p>
</td>
    </tr><tr>
    <td>role</td><td><code>string</code></td><td><p>The role of the person. You cannot set this, default is external</p>
</td>
    </tr><tr>
    <td>profile</td><td><code>Object</code></td><td><p>Contains profile info</p>
</td>
    </tr><tr>
    <td>profile.fullName</td><td><code>string</code></td><td><p>First and surname combined</p>
</td>
    </tr><tr>
    <td>profile.firstName</td><td><code>string</code></td><td><p>First name of the person</p>
</td>
    </tr><tr>
    <td>profile.lastName</td><td><code>string</code></td><td><p>Last name of the person</p>
</td>
    </tr><tr>
    <td>profile.email</td><td><code>string</code></td><td><p>E-mail address</p>
</td>
    </tr><tr>
    <td>profile.description</td><td><code>string</code></td><td><p>Description of this user</p>
</td>
    </tr><tr>
    <td>profile.picture</td><td><code>string</code></td><td><p>Profile picture (url)</p>
</td>
    </tr><tr>
    <td>profile.locale</td><td><code>string</code></td><td><p>ISO code describing language and country (en-US)</p>
</td>
    </tr><tr>
    <td>profile.timezone</td><td><code>number</code></td><td><p>Hours from GMT</p>
</td>
    </tr><tr>
    <td>profile.location</td><td><code>string</code></td><td><p>Location of the user</p>
</td>
    </tr><tr>
    <td>profile.gender</td><td><code>string</code></td><td><p>M for male, F for female or U for unknown / other</p>
</td>
    </tr><tr>
    <td>metadata</td><td><code>object</code></td><td><p>Optional object with custom metadata</p>
</td>
    </tr>  </tbody>
</table>

Originator of a Message

<a name="new_Originator_new"></a>

### new Originator(opts)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>opts</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>opts.name</td><td><code>string</code></td><td><p>Name of a person or system originating the Message, default is Anonymous</p>
</td>
    </tr><tr>
    <td>opts.role</td><td><code>string</code></td><td><p>The role of the person. You cannot set this, default is external</p>
</td>
    </tr><tr>
    <td>opts.profile</td><td><code>Object</code></td><td><p>Contains profile info</p>
</td>
    </tr><tr>
    <td>opts.profile.fullName</td><td><code>string</code></td><td><p>First and surname combined</p>
</td>
    </tr><tr>
    <td>opts.profile.firstName</td><td><code>string</code></td><td><p>First name of the person</p>
</td>
    </tr><tr>
    <td>opts.profile.lastName</td><td><code>string</code></td><td><p>Last name of the person</p>
</td>
    </tr><tr>
    <td>opts.profile.email</td><td><code>string</code></td><td><p>E-mail address</p>
</td>
    </tr><tr>
    <td>opts.profile.description</td><td><code>string</code></td><td><p>Description of this user</p>
</td>
    </tr><tr>
    <td>opts.profile.picture</td><td><code>string</code></td><td><p>Profile picture (url)</p>
</td>
    </tr><tr>
    <td>opts.profile.locale</td><td><code>string</code></td><td><p>ISO code describing language and country (en-US)</p>
</td>
    </tr><tr>
    <td>opts.profile.timezone</td><td><code>number</code></td><td><p>Hours from GMT</p>
</td>
    </tr><tr>
    <td>opts.profile.location</td><td><code>string</code></td><td><p>Location of the user</p>
</td>
    </tr><tr>
    <td>opts.profile.gender</td><td><code>string</code></td><td><p>M for male, F for female or U for unknown / other</p>
</td>
    </tr><tr>
    <td>opts.metadata</td><td><code>object</code></td><td><p>Optional object with custom metadata</p>
</td>
    </tr>  </tbody>
</table>

<a name="Reply"></a>

## Reply
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>threadId</td><td><code>string</code></td><td><p>Unique id specific to this chat</p>
</td>
    </tr><tr>
    <td>originator</td><td><code><a href="#Originator">Originator</a></code></td><td><p>Originator</p>
</td>
    </tr><tr>
    <td>messages</td><td><code>Array.&lt;ReplyMessage&gt;</code></td><td><p>List of messages</p>
</td>
    </tr><tr>
    <td>messages[].fallback</td><td><code>string</code></td><td><p>Textual representation of any responses</p>
</td>
    </tr><tr>
    <td>messages[].replyTo</td><td><code>string</code></td><td><p>Optional replying to query</p>
</td>
    </tr><tr>
    <td>messages[].contexts</td><td><code>array</code></td><td><p>Optional List of context names</p>
</td>
    </tr><tr>
    <td>messages[].params</td><td><code>array</code></td><td><p>Optional key value pair of parameters</p>
</td>
    </tr><tr>
    <td>messages[].intents</td><td><code>array</code></td><td><p>Optional list of intent names determined</p>
</td>
    </tr><tr>
    <td>messages[].responses</td><td><code>Array.&lt;Response&gt;</code></td><td><p>List of response templates</p>
</td>
    </tr><tr>
    <td>messages[].responses[].type</td><td><code>string</code></td><td><p>Template type</p>
</td>
    </tr><tr>
    <td>messages[].responses[].payload</td><td><code>Object</code></td><td><p>Template payload</p>
</td>
    </tr><tr>
    <td>messages[].responses[].delay</td><td><code>Number</code></td><td><p>Number of seconds the response is delayed</p>
</td>
    </tr>  </tbody>
</table>

Reply you receive from Flow.ai

<a name="new_Reply_new"></a>

### new Reply()
Constructor

<a name="build"></a>

## build
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>speech</td><td><code>string</code></td><td><p>Text representing the Message</p>
</td>
    </tr><tr>
    <td>originator</td><td><code><a href="#Originator">Originator</a></code></td><td><p>Originator</p>
</td>
    </tr><tr>
    <td>meta</td><td><code><a href="#Metadata">Metadata</a></code></td><td><p>Meta data</p>
</td>
    </tr><tr>
    <td>attachment</td><td><code><a href="#new_Attachment_new">Attachment</a></code></td><td><p>Optional attachment</p>
</td>
    </tr>  </tbody>
</table>

Message you send to Flow.ai

