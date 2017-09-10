const {
  LiveClient,
  Message,
  Originator
} = require("../../lib")

// On windows you might get a TLS rejected error while accessing a HTTPS/ WSS endpoint
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// Create a new Client
const client = new LiveClient('NzRkNDFmMGEtYTM5OC00Njk0LWI4MTktZTA4NmJjZjEyMTg3fDIyMWJkMjY3LTdjYTItNGIwZi05NDQwLThiNzg2ZDRmYjZkNg==', 'http://localhost:6005')
client.on(LiveClient.CONNECTED, () => {
  console.log('--> Connected')

  const originator = new Originator({
    name: "Boss",
    profile: {
      fullName: "The Boss Man"
    }
  })

  const message = new Message({
    threadId: 'john',
    traceId: 1,
    speech: "Verzekeren jullie ook katten?",
    originator
  })
  //
  message.metadata.addContext('home')
  message.metadata.addParam('room', 'kitchen')
  message.metadata.addParam('utility', 'lights')
  message.metadata.addParam('switch', 'on')

  client.send(message)
  client.noticed('john')
})

// Bind to the events
client.on(LiveClient.DISCONNECTED, () => {
  console.log('--> The connection is gone')
})
client.on(LiveClient.REPLY_RECEIVED, (reply) => {
  console.log('--> Received a reply', reply, reply.messages[0])
})
client.on(LiveClient.MESSAGE_SEND, (message) => {
  console.log('--> The client is sending a message', message)
})
client.on(LiveClient.MESSAGE_DELIVERED, (message) => {
  console.log('--> Delivered a message we just send', message)
})
client.on(LiveClient.RECONNECTING, () => {
  console.log('--> Trying to reconnect')
})
client.on(LiveClient.ERROR, (err) => {
  console.log('--> Error while doing stuff', err)
})
client.on(LiveClient.CHECKED_UNNOTICED_MESSAGES, (result) => {
  console.log('--> Checked unnoticed messages', result)
})

client.checkUnnoticed()

// client.start()
