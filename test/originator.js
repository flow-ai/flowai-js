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

  it("can have a rich profile", () => {
    const o = new Originator({
      name: 'Gijs van de Nieuwegiessen',
      profile: {
        email: 'gijs@flow.ai',
        timezone: -2,
        location: 'Toronto, Canada',
        description: 'CEO and co-founder of Flow.ai'
      }
    })

    expect(o.profile.email).to.equal('gijs@flow.ai')
    expect(o.profile.timezone).to.equal(-2)
    expect(o.profile.location).to.equal('Toronto, Canada')
    expect(o.profile.description).to.equal('CEO and co-founder of Flow.ai')
  })
})
