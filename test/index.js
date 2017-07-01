import chai, { expect, assert } from 'chai'
import chaiEventemitter from 'chai-eventemitter'
import {
  LiveClient,
  LIVE_EVENTS
} from "../lib"
import Exception from '../lib/exception'
import Unique from '../lib/unique'
import Message from '../lib/message'

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
})
