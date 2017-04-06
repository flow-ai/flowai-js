import debug from 'debug'

debug('flowai:originator')

/**
 * Originator of a Message
 * @class
 * @property {string} name - Name of a person or system originating the Message
 * @property {string} profile.fullName - First and surname of person
 * @property {string} profile.firstName - First name of the person
 * @property {string} profile.lastName - Last name of the person
 * @property {string} profile.picture - Profile picture (url)
 * @property {string} profile.locale - ISO code describing language and country (en-US)
 * @property {string} profile.gender - M for male, F for female or U for unknown / other
 **/
class Originator {

  constructor(data) {
    this.name = data.name || 'Anonymous'
    this.role = data.role || 'external'

    const profile = data.profile || {}
    this.profile = {
      fullName: profile.fullName || undefined,
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      picture: profile.picture || undefined,
      locale: profile.locale || undefined,
      gender: profile.gender || undefined
    }
  }
}

export default Originator
