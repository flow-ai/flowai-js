import chai, { expect, assert } from 'chai'
import chaiEventemitter from 'chai-eventemitter'
import Originator from '../lib/originator'

chai.use(chaiEventemitter)

describe("Originator", () => {

  it("can construct without data", () => {
    expect(() => new Originator()).to.not.throw()
  })

  it("has default values", () => {
    const o = new Originator()
    expect(o.name).to.equal('Anonymous')
    expect(o.role).to.equal('external')
  })

  it("can have other values", () => {
    const o = new Originator({
      name: 'Gijs van de Nieuwegiessen',
      profile: {
        firstName: 'Gijs',
        lastName: 'Nieuwegiessen, van de'
      },
      metadata: {
        userName: 'Geeza'
      }
    })
    expect(o.name).to.equal('Gijs van de Nieuwegiessen')
    expect(o.profile.firstName).to.equal('Gijs')
    expect(o.metadata.userName).to.equal('Geeza')
  })
})
