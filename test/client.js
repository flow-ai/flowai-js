import chai, { expect, assert } from 'chai'
import { createReadStream } from 'fs'
import chaiEventemitter from 'chai-eventemitter'
import {
  LiveClient,
  LIVE_EVENTS
} from "../lib"
import Exception from '../lib/exception'
import Message from '../lib/message'
import Reply from '../lib/reply'
import Attachment from '../lib/attachment'
import EventAttachment from '../lib/event-attachment'
import FileAttachment from '../lib/file-attachment'

chai.use(chaiEventemitter)

const __CLIENT_ID__ = 'NzRkNDFmMGEtYTM5OC00Njk0LWI4MTktZTA4NmJjZjEyMTg3fGIyNzIxMGUzLWU5ZmEtNDkyYS04YTM1LTliOTM0NTAwMDM4Mw=='
const __ENDPOINT__ = 'http://localhost:6005'

describe("Flow.ai SDK Client", () => {

  it("ClientId must be string", () => {
    expect(() => new LiveClient({})).to.throw()
  })

  it("ClientId should not be undefined", () => {
    expect(() => new LiveClient()).to.throw()
  })

  it("Create legacy way", () => {
    expect(() => new LiveClient(__CLIENT_ID__)).to.not.throw()
  })

  it("Create new way", () => {
    expect(() => new LiveClient({ clientId: __CLIENT_ID__ })).to.not.throw()
  })

  it("Create with options", () => {
    const client1 = new LiveClient({
      clientId: __CLIENT_ID__,
      endpoint: __ENDPOINT__,
      storage: 'local'
    })
    expect(client1._endpoint).to.equal(__ENDPOINT__)
    expect(client1._storage).to.equal('local')

    const client2 = new LiveClient({
      clientId: __CLIENT_ID__,
      storage: 'session'
    })
    expect(client2._storage).to.equal('session')
  })

  it("Throws not on invalid clientId", () => {
    const client = new LiveClient('asassaasassasaasassaas')
    expect(() => client.start()).to.not.throw()
  })

  it("Throws on invalid sessionId", () => {
    const client = new LiveClient(__CLIENT_ID__)
    expect(() => client.start(1)).to.throw()
  })

  it("Throws on invalid threadId", () => {
    const client = new LiveClient(__CLIENT_ID__)
    expect(() => client.start('', 1)).to.throw()
  })

  it("Throws on sending empty", () => {
    const client = new LiveClient(__CLIENT_ID__, __ENDPOINT__)
    expect(() => client.send()).to.throw()
  })

  it("Throws on sending invalid options", () => {
    const client = new LiveClient(__CLIENT_ID__, __ENDPOINT__)
    expect(() => client.send({}, {})).to.throw()
  })

  it("Throws on sending when disconnection", () => {
    const client = new LiveClient(__CLIENT_ID__, __ENDPOINT__)
    expect(() => client.send({})).to.throw()
  })

  it("Cannot create empty exception", () => {
    expect(() => new Exception()).to.throw()
  })

  it("Can create exception with string", () => {
    expect(() => new Exception('Bad stuff')).to.not.throw()
  })

  it("Can create exception with other exception", () => {
    const ex = new Exception('Bad stuff')
    expect(() => new Exception(ex)).to.not.throw()
    expect(new Exception(ex)).to.be.equal(ex)
  })

  it("Can create exception with Error", () => {
    const ex = new Exception(new Error('Bad stuff'))
    expect(ex.message).to.be.equal('Bad stuff')
  })

  it("Message has metadata", () => {
    const m = new Message()
    expect(m.metadata).to.be.not.null
  })

  it("Can create attachment", () => {
    const attachment = new Attachment('event', { name: 'monkey' })
    expect(attachment).to.be.not.null
  })

  it("Can create specific attachment", () => {
    const event = new EventAttachment('Coolness')
    expect(event).to.be.not.null
  })

  it("Can add attachment to message", () => {
    const m = new Message()
    expect(m.attachment).to.be.undefined

    m.attachment = new EventAttachment('Coolness')

    expect(m.attachment).to.be.not.null
  })

  it("Can construct message with attachment, without speech", () => {
    const m = new Message({
      attachment: new EventAttachment('Coolness')
    })
    expect(m.attachment).to.be.not.undefined
    expect(m.speech).to.be.equal('event attachment')
  })

  it("Can construct message with attachment, with speech", () => {
    const m = new Message({
      speech: 'coolness',
      attachment: new EventAttachment('Coolness')
    })
    expect(m.speech).to.be.equal('coolness')
  })

  it("Cannot construct message with invalid attachment", () => {
    expect(() => new Message({ attachment: {}})).to.throw()
  })

  it("Can construct FileAttachment", () => {
    const stream = createReadStream('../media/test.png')
    const attachment = new FileAttachment(stream)
    expect(attachment).to.be.not.null
  })

  it("Can construct message back with JSON", () => {
    const data = {
      "threadId": "9867517ad8b04f33b44e43ed78dacccb",
      "traceId": 1503132880254,
      "speech": "event attachment",
      "originator": {
        "name": "John",
        "role": "external",
        "profile": {
          "fullName": "John Doe"
        },
        "metadata": {
          "userName": "Geeza"
        }
      },
      "attachment": {
        "type": "event",
        "payload": {
          "name": 'TEST'
        }
      },
      "metadata": {
        "language": "en",
        "timezone": 2,
        "contexts": ["socket"],
        "params": {},
        "domain": {
          "realm": "browser",
          "title": "Local webclient"
        }
      }
    }
    expect(() => Message.build(data)).to.not.throw()
  })

  it("Can construct a reply message with JSON", () => {
    const data = {
      "threadId": "4243324233422342344343432",
      "messages": [
        {
          "fallback": "Hi how can I help?",
          "silent": false,
          "replyTo": "hello",
          "originator": {
            "actorId": "4243324233422342344343432",
            "userId": "flowai|4243324233422342344343432",
            "name": "Awesome Bot",
            "role": "bot",
            "profile": {
              "description": "Flow.ai",
              "locale": "en",
              "picture": "https://flow.ai/img/brains/flowai.svg"
            },
            "metadata": {
              "userName": "Geeza"
            }
          },
          "actions": [],
          "responses": [
            {
              "type": "text",
              "payload": {
                "text": "Hi how can I help?"
              },
              "delay": 20
            }
          ],
          "intents": [],
          "flow": {
            "flowId": "4243324233422342344343432",
            "title": "Greeting"
          },
          "step": {
            "stepId": "4243324233422342344343432",
            "title": "hello"
          },
          "params": {},
          "contexts": [
            "4243324233422342344343432"
          ]
        }
      ],
      "originator": {
        "actorId": "4243324233422342344343432",
        "userId": "flowai|4243324233422342344343432",
        "name": "Awesome bot",
        "role": "bot",
        "profile": {
          "description": "Flow.ai",
          "locale": "en",
          "picture": "https://flow.ai/img/brains/flowai.svg"
        }
      }
    }
    expect(() => new Reply(data)).to.not.throw()
    const r = new Reply(data)
    expect(r.messages[0].responses[0].delay).to.equal(20)
  })
})
