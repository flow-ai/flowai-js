import chai, { expect, assert } from 'chai'
import chaiEventemitter from 'chai-eventemitter'
import Unique from '../lib/unique'

chai.use(chaiEventemitter)

describe("Unique", () => {

  it("Unique must have opts", () => {
    expect(() => new Unique()).to.throw(Error)
  })

  it("Unique must have values", () => {
    const uniqueId = new Unique({
      clientId: 'abc',
      key: 'key',
      value: 'value',
      engine: 'local'
    })
    expect(uniqueId.id()).to.be.equal('value')
  })

  it("Check if unique exists", () => {
    new Unique({
      clientId: 'abc',
      key: 'key',
      value: 'value',
      engine: 'session'
    })

    expect(Unique.exists({
      clientId: 'abc',
      key: 'key',
      engine: 'session'
    })).to.be.true
  })

  it("Check if unique does not exist", () => {
    new Unique({
      clientId: 'abc',
      key: 'key',
      value: 'value',
      engine: 'local'
    })
    expect(Unique.exists({
      clientId: 'abc2',
      key: 'key2',
      engine: 'local'
    })).to.be.false
  })

  it("Unique exists throws with invalid arguments", () => {
    expect(() => Unique.exists()).to.throw(Error)
    expect(() => Unique.exists({ clientId: null, key: null })).to.throw(Error)
    expect(() => Unique.exists('null', null)).to.throw(Error)
    expect(() => Unique.exists(null, 'null')).to.throw(Error)
  })
})
