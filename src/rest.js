import debug from 'debug'
import querystring from 'querystring'
import fetch from 'fetch-everywhere'

debug('flowai:rest')

// Private class
class Rest {

  constructor(endpoint) {
    debug(`Creating a new REST service with endpoint '${endpoint}'`)
    this._endpoint = endpoint
  }

  get(options) {
    const {
      path,
      token,
      queryParams
    } = options

    const url = `${this._endpoint}/${path}`,
          headers = this._createHeaders(token)

    debug(`GET call to url '${url}' with headers and queryParams`, headers, queryParams)

    return this._call(url, { headers }, queryParams)
  }

  post(options) {
    const {
      path,
      token,
      payload,
      queryParams
    } = options

    const url = `${this._endpoint}/${path}`,
          headers = this._createHeaders(token)

    const enveloppe = {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(payload || {})
    }

    debug(`POST call to url '${url}' with headers and enveloppe`, headers, enveloppe)

    return this._call(url, enveloppe, queryParams)
  }

  _createHeaders(token) {
    let headers = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers = Object.assign(headers, {
        Authorization: `Bearer ${token}`
      })
    }

    return headers
  }

  _call(url, enveloppe, queryParams) {
    return new Promise((resolve, reject) => {
      if(queryParams) {
        url = `${url}?${querystring.stringify(queryParams)}`
      }

      debug(`Calling URL '${url}'`)

      fetch(url, enveloppe)
        .then((response) => {
          debug('Received a response')
          resolve(response.json())
        })
        .catch((err) => {
          debug('Failed with error', err)
          reject(err)
        })
    })
  }
}
export default Rest
