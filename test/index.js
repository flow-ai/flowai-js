import chai, { expect, assert } from 'chai'
import chaiEventemitter from 'chai-eventemitter'
import {
  LiveClient,
  LIVE_EVENTS
} from "../lib"
import Exception from '../lib/exception'
import Unique from '../lib/unique'
import Message from '../lib/message'
import Attachment from '../lib/attachment/attachment'
import { EventAttachment } from '../lib/attachment'

chai.use(chaiEventemitter)

const __CLIENT_ID__ = 'NzRkNDFmMGEtYTM5OC00Njk0LWI4MTktZTA4NmJjZjEyMTg3fGIyNzIxMGUzLWU5ZmEtNDkyYS04YTM1LTliOTM0NTAwMDM4Mw=='
const __ENDPOINT__ = 'http://localhost:6005'

describe("Flow.ai SDK", () => {

  it("Unique must have values", () => {
    expect(() => new Unique()).to.throw(Error)
  })

  it("Unique must have values", () => {
    const uniqueId = new Unique('abc', 'key', 'value')
    expect(uniqueId.id()).to.be.equal('value')
  })

  it("Check if unique exists", () => {
    new Unique('abc', 'key', 'value')
    expect(Unique.exists('abc', 'key')).to.be.true
  })

  it("Check if unique does not exist", () => {
    new Unique('abc1', 'key1', 'value1')
    expect(Unique.exists('abc2', 'key2')).to.be.false
  })

  it("Unique exists throws with invalid arguments", () => {
    expect(() => Unique.exists(null, null)).to.throw(Error)
    expect(() => Unique.exists('null', null)).to.throw(Error)
    expect(() => Unique.exists(null, 'null')).to.throw(Error)
  })

  it("ClientId must be string", () => {
    expect(() => new LiveClient({})).to.throw(Exception)
  })

  it("ClientId should not be undefined", () => {
    expect(() => new LiveClient()).to.throw(Exception)
  })

  it("Throws not on invalid clientId", () => {
    const client = new LiveClient('asassaasassasaasassaas')
    expect(() => client.start()).to.not.throw(Exception)
  })

  it("Throws on invalid sessionId", () => {
    const client = new LiveClient('')
    expect(() => client.start(1)).to.throw(Exception)
  })

  it("Throws on invalid threadId", () => {
    const client = new LiveClient('')
    expect(() => client.start('', 1)).to.throw(Exception)
  })

  it("Throws on sending empty", () => {
    const client = new LiveClient(__CLIENT_ID__, __ENDPOINT__)
    expect(() => client.send()).to.throw(Exception)
  })

  it("Throws on sending invalid options", () => {
    const client = new LiveClient(__CLIENT_ID__, __ENDPOINT__)
    expect(() => client.send({}, {})).to.throw(Exception)
  })

  it("Throws on sending when disconnection", () => {
    const client = new LiveClient(__CLIENT_ID__, __ENDPOINT__)
    expect(() => client.send({})).to.throw(Exception)
  })

  it("Cannot create empty exception", () => {
    expect(() => new Exception()).to.throw(Error)
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
    expect(() => new Message({ attachment: {}})).to.throw(Exception)
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
    Message.build(data)
    expect(() => Message.build(data)).to.not.throw()
  })


})
