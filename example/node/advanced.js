const {
  LiveClient,
  Message,
  Originator
} = require("flowai-js")

// On windows you might get a TLS rejected error while accessing a HTTPS/ WSS endpoint
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const clientId = "YOUR CLIENT ID"

const client = new LiveClient(clientId)

client.on(LiveClient.CONNECTED, () => {
  console.log('--> Connected')

  // Create the sender of the message
  const originator = new Originator({
    name: "John",
    profile: {
      fullName: "John Doe"
    }
  })

  // Compose a message
  const message = new Message({
    speech: "Hi",
    originator
  })

  // Add some meta data
  // just for fun
  message.metadata.addContext('home')
  message.metadata.addParam('room', 'kitchen')
  message.metadata.addParam('utility', 'lights')
  message.metadata.addParam('switch', 'on')

  // Send a message
  client.send(message)
})

client.on(LiveClient.DISCONNECTED, () => {
  console.log('--> The connection is gone')
})

client.on(LiveClient.REPLY_RECEIVED, reply => {
  console.log('--> Received a reply', reply, reply.messages[0])
})

client.on(LiveClient.MESSAGE_SEND, message => {
  console.log('--> The client is sending a message', message)
})

client.on(LiveClient.MESSAGE_DELIVERED, message => {
  console.log('--> Delivered a message we just sent', message)
})

client.on(LiveClient.RECONNECTING, () => {
  console.log('--> Trying to reconnect')
})

client.on(LiveClient.ERROR, err => {
  console.log('--> Error while doing stuff', err)
})

client.on(LiveClient.CHECKED_UNNOTICED_MESSAGES, result => {
  console.log('--> Checked unnoticed messages', result)
})

client.start()
