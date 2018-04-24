const {
  LiveClient,
  Message,
  Originator
} = require("../../lib")

const client = new LiveClient('YOUR CLIENT ID')

client.on(LiveClient.CONNECTED, () => {

  console.log('--> Connected')
  const originator = new Originator({ name: "Boss" })

  const message = new Message({
    speech: "Behold, I'm pure awesomeness!",
    originator
  })

  client.send(message)
})

// You must add a listener for error events!
client.on(LiveClient.ERROR, (err) => {
  console.log('--> Error while sending, receiving messages', err)
})

client.start()
