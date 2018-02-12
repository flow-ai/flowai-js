import debug from 'debug'

debug('flowai:originator')

/**
 * Originator of a Message
 * @class
 * @property {string} name - Name of a person or system originating the Message, default is Anonymous
 * @property {string} role - The role of the person. You cannot set this, default is external
 * @property {string} profile.fullName - First and surname combined
 * @property {string} profile.firstName - First name of the person
 * @property {string} profile.lastName - Last name of the person
 * @property {string} profile.email - E-mail address
 * @property {string} profile.description - Description of this user
 * @property {string} profile.picture - Profile picture (url)
 * @property {string} profile.locale - ISO code describing language and country (en-US)
 * @property {number} profile.timezone - Hours from GMT
 * @property {string} profile.location - Location of the user
 * @property {string} profile.gender - M for male, F for female or U for unknown / other
 * @property {string} metadata - Optional object with custom metadata
 **/
class Originator {

  constructor(opts) {
    const data = opts || {}
    this.name = data.name || 'Anonymous'
    this.role = data.role || 'external'

    const profile = data.profile || {}
    this.profile = {
      fullName: profile.fullName || undefined,
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      email: profile.email || undefined,
      description: profile.description || undefined,
      picture: profile.picture || undefined,
      locale: profile.locale || undefined,
      timezone: profile.timezone || undefined,
      location: profile.location || undefined,
      gender: profile.gender || undefined
    }

    this.metadata = data.metadata || undefined
  }
}

export default Originator
