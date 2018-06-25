import chai, { expect, assert } from 'chai'
import EventAttachment from '../lib/event-attachment'

describe("Attachment", () => {

  it("can construct with just a name", () => {
    const a = new EventAttachment("a")
    expect(a.payload.name).to.equal("a")
  })

  it("it must have a name", () => {
    expect(() => new EventAttachment()).to.throw()
    expect(() => new EventAttachment(null)).to.throw()
    expect(() => new EventAttachment({})).to.throw()
  })

  it("it must have a valid label", () => {
    expect(() => new EventAttachment("a", {})).to.throw()
  })

  it("can construct with name and label", () => {
    const a = new EventAttachment("a", "b")
    expect(a.payload.name).to.equal("a")
    expect(a.payload.label).to.equal("b")
  })
})
