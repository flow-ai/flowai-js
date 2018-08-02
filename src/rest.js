import debug from 'debug'
import querystring from 'querystring'
import fetch from 'fetch-everywhere'

debug('flowai:rest')

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    switch(response.status) {
      case 400: {
        console.error('It seems your clientId, sessionId or configuration is invalid')
        break
      }
      case 401:
      case 403: {
        console.error('It seems your domain is not whitelisted properly')
        break
      }
      default: {
        console.error('An error occurred at the Flow.ai API. Please contact us at slack.flow.ai')
        break
      }
    }

    const error = new Error(response.statusText)
    error.status = response.status
    throw error
  }
}

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

  upload(formData) {

    debug('Uploading', formData)

    const url = `${this._endpoint}/thread.upload`

    return new Promise((resolve, reject) => {
      const enveloppe = {
        method: 'POST',
        body: formData
      }

      debug(`Calling URL '${url}'`)

      fetch(url, enveloppe)
        .then(response => {
          resolve(response.json())
        })
        .catch(err => {
          debug('Failed with error', err)
          reject(err)
        })
    })
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
        .then(checkStatus)
        .then(response => {
          resolve(response.json())
        })
        .catch(err => {
          debug('Failed with error', err)
          reject(err)
        })
    })
  }
}
export default Rest
