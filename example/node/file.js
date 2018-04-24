const { createReadStream } = require('fs')
const {
  LiveClient,
  Message,
  Originator,
  FileAttachment
} = require("../../lib")

const client = new LiveClient({
  clientId: "YOUR CLIENT ID",
  origin: "my.website"
})

client.on(LiveClient.CONNECTED, () => {

  console.log('--> Connected')

  const stream = createReadStream(__dirname + '/../../media/test.png')

  const message = new Message({
    attachment: new FileAttachment(stream),
    originator: new Originator({ name: "Boss" })
  })

  client.send(message)
})

client.start()
