import EventEmitter from 'events'
import Backoff from 'backo'
import debug from 'debug'
import { w3cwebsocket } from 'websocket'
import Message from './message'
import Reply from './reply'
import Rest from './rest'
import Unique from './unique'
import Exception from './exception'
import FileAttachment from './file-attachment'

debug('flowai:liveclient')

/**
 * Live streaming websocket client extends EventEmitter
 * @class
 * @example
 * // Node.js
 * const client = new LiveClient({
 *   clientId: 'MY CLIENT ID',
 *   origin: 'https://my.website'
 * })
 *
 * // Web
 * const client = new LiveClient({
 *   clientId: 'MY CLIENT ID',
 *   storage: 'session'
 * })
 *
 * // Lambda function
 * const client = new LiveClient({
 *   clientId: 'MY CLIENT ID',
 *   storage: 'memory'
 * })
 **/
class LiveClient extends EventEmitter {

  /**
   * Constructor
   * @constructor
   * @param {(object|string)} opts - Configuration options or shorthand for just clientId
   * @param {string} opts.clientId - Mandatory Client token
   * @param {string} opts.storage - Optional, 'session' for using sessionStorage, 'local' for localStorage or `memory` for a simple memory store
   * @param {string} opts.endpoint - Optional, only for testing purposes
   * @param {string} opts.origin - When running on Nodejs you MUST set the origin
   * @param {boolean} opts.silent - Optional, console.errors will not be shown
   * @param {string} opts.ott - Optional, console.errors will not be shown
   * @returns {LiveClient}
   *
   */
  constructor(opts) {

    super()

    // Backwards compatibility
    if (typeof (opts) === 'string') {
      this._clientId = arguments[0]

      if (arguments.length == 2) {
        this._endpoint = arguments[1]
      }
    } else if (typeof (opts) === 'object') {
      this._clientId = opts.clientId
      this._endpoint = opts.endpoint

      if (opts.storage === 'session') {
        this._storage = 'session'
      } else {
        this._storage = 'local'
      }

      if (typeof opts.silent === 'boolean') {
        this._silent = opts.silent
      } else {
        this._silent = false
      }

      if (opts.ott && typeof opts.ott === 'string') {
        this._ott = opts.ott
      } else {
        this._ott = null
      }

      if (typeof window === 'undefined') {
        this._origin = opts.origin || undefined
      }
    }

    if (typeof (this._clientId) !== 'string') {
      throw new Exception("Invalid or lacking argument for LiveClient. You must provide a clientId. Check the dashboard", 'user')
    }

    this._storage = this._storage || 'local'
    this._endpoint = this._endpoint || 'https://sdk.flow.ai'
    this._rest = new Rest(this._endpoint, this._silent)
    this.debugLogs = false
    this._init()

    debug('Constructed a new LiveClient', this)
  }

  /**
   * Session Id of the connection
   * @method
   * @returns {?string} Null if no connection is active
   **/
  get sessionId() {
    const sessionId = (this._session) ? this._session.id() : null

    debug(`sessionId is '${sessionId}'`)

    return sessionId
  }

  /**
   * Session Id of the connection
   * @param {?string} value - Change the session ID
   **/
  set sessionId(value) {
    debug(`Creating a new sessionId with value '${value}'`)
    this.log(`Setting sessionId=${value}`)
    this._session = new Unique({
      clientId: this._clientId,
      key: 'sessionId',
      value,
      engine: this._storage
    })
  }

  /**
   * Default Thread Id to be used for any messages being send
   * @returns {?string} Null if no connection is active
   **/
  get threadId() {
    const threadId = (this._thread) ? this._thread.id() : null

    debug(`threadId is '${threadId}'`)

    return threadId
  }

  /**
   * Session Id of the connection
   * @param {?string} value - Change the thread ID
   **/
  set threadId(value) {
    debug(`Creating a new threadId with value '${value}'`)
    this.log(`Setting threadId=${value}`)
    // Create a new Thread
    this._thread = new Unique({
      clientId: this._clientId,
      key: 'threadId',
      value,
      engine: this._storage
    })
    this.log(`ThreadId=${this.threadId} after setting value=${value}`)
  }

  /**
   * Secret
   * @returns {?string}
   **/
  get secret() {
    let secret = this._secret

    if (typeof secret !== 'string') {
      secret = Unique.get({
        clientId: this._clientId,
        key: 'secret',
        engine: this._storage
      })
    }

    return secret
  }

  /**
   * Secret
   * @param {?string} value - Change the Secret
   **/
  set secret(value) {
    debug(`Setting a new secret with value '${value}'`)

    this._secret = new Unique({
      clientId: this._clientId,
      key: 'secret',
      value,
      engine: this._storage
    })
  }

  /**
   * Check if the connection is active
   *
   * @example
   * if(client.isConnected) {
   *   // Do something awesome
   * }
   * @returns {boolean} True if the connection is active
   **/
  get isConnected() {
    const isConnected = (this._socket !== null)

    debug(`isConnected is '${isConnected}'`)

    return isConnected
  }

  /**
   * Start the client
   * @method
   * @param {string} threadId - Optional. When assigned, this is the default threadId for all messages that are send
   * @param {string} sessionId - Optional. Must be unique for every connection
   *
   * @example
   * // Start, will generate thread and sessionId
   * client.start()
   *
   * @example
   * // Start with your own custom threadId
   * client.start('UNIQUE THREADID FOR USER')
   **/
  start(threadId, sessionId) {
    try {

      if (sessionId && typeof (sessionId) !== 'string') {
        throw new Exception("sessionId must be a string", 'user')
      }

      if (threadId && typeof (threadId) !== 'string') {
        throw new Exception("threadId must be a string", 'user')
      }

      debug(`Starting the client with sessionId ${sessionId} and threadId '${threadId}'`)

      // Create a new backoff policy
      this._backoff = new Backoff({
        min: 100,
        max: 20000
      })

      // Create a new Thread
      this.sessionId = sessionId

      // Create a new Thread
      this._prevThreadId = this.threadId
      this.threadId = threadId

      this._openConnection()

    } catch (err) {
      // Wrap the error
      throw new Exception(`Failed to start the client ${err}`, 'connection', err)
    }
  }

  /**
   * Stop the client
   * @desc Use this method to temp disconnect a client
   *
   * @example
   * // Close the connection
   * client.stop()
   **/
  stop() {
    try {
      debug(`Stopping the client`)
      this._closeConnection()
    } catch (err) {
      // Wrap the error
      throw new Exception("Failed to stop the client", 'connection', err)
    }
  }

  /**
   * Close the connection and completely reset the client
   *
   * @example
   * // Close the connection and reset the client
   * client.destroy()
   **/
  destroy() {
    this._closeConnection()
    this._init()
  }

  /**
   * Send a Message
   * @desc This method triggers a `LiveClient.MESSAGE_SEND` event
   * @param {object} message - Message you want to send
   *
   * @example
   * const originator = new Originator({
   *   name: "Jane"
   * })
   *
   * const message = new Message({
   *  speech: "Hi!",
   *  originator
   * })
   *
   * client.send(message)
   * @returns {object} Message that was send
   **/
  send(message) {

    debug(`Sending message`, message)

    if (!this.isConnected) {
      throw new Exception("Could not send the message. The socket connection is disconnected.", 'user')
    }

    if (!(message instanceof Message)) {
      throw new Exception("Could not send the message. You should send a valid Message object.", 'user')
    }

    // Set the default
    message.threadId = message.threadId || this.threadId

    // Update threadId
    this.log(`Updating threadId in send, this.threadId=${this.threadId}, message.threadId=${message.threadId}`)
    this.threadId = message.threadId

    try {
      this.emit(LiveClient.MESSAGE_SEND, message)

      if (message.attachment && message.attachment instanceof FileAttachment) {

        const formData = message.attachment.payload.formData
        formData.append('payload', JSON.stringify(Object.assign({},
          message,
          {
            attachment: undefined,
            clientId: this._clientId,
            sessionId: this.sessionId
          }
        )))

        debug('Uploading formData', formData)

        const headers = {
          'x-flowai-secret': this.secret
        }

        this._rest.upload(formData, headers)
          .then(result => {
            if (result.status !== 'ok') {
              this.emit(LiveClient.ERROR, new Exception(new Error('Failed to upload file.'), 'connection'))
            } else {
              this.emit(LiveClient.MESSAGE_DELIVERED, result.payload)
            }
          })
          .catch(err => {
            debug('Error while trying to upload a file', err)
            this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
          })

        return message
      }

      if (typeof this.secret === 'string') {
        message.nonce = this.secret
      }

      const enveloppe = JSON.stringify({
        type: 'message.send',
        payload: message
      })

      debug(`Creating message enveloppe`, enveloppe)

      setTimeout(() => {
        // We add a tiny delay because
        // messages instantly send after 'connection'
        // event get lost
        if (this._socket) this._socket.send(enveloppe)
      }, 50)

    } catch (err) {
      this.emit(LiveClient.ERROR, new Exception(err))
    }

    return message
  }

  sendUserTypingActivity(params) {
    debug(`Sending user typing activity`)

    if (!this.isConnected) {
      throw new Exception("Could not send the user typing activity. The socket connection is disconnected.", 'user')
    }

    try {
      const originator = (params && params.originator) || {}

      const enveloppe = JSON.stringify({
        type: 'activity.user.typing',
        payload: {
          clientId: this._clientId,
          threadId: this.threadId,
          originator
        }
      })

      debug(`Creating user typing activity enveloppe`, enveloppe)

      setTimeout(() => {
        // We add a tiny delay because
        // messages instantly send after 'connection'
        // event get lost
        if (this._socket) this._socket.send(enveloppe)
      }, 50)

    } catch (err) {
      this.emit(LiveClient.ERROR, new Exception(err))
    }
  }
  /**
   * Merge two threads from different channels.
   * This methods is not yet publicy supported since we don't have a way yet to provide a mergerKey.
   * @param {string} mergerKey - Unique token representing merge Request
   * @param {string} threadId - Optional. The threadId to merge
   * @param {string} sessionId - Optional. The sessionId to assign to the thread
   **/
  merger(mergerKey, threadId, sessionId) {

    debug(`Merging threads '${mergerKey}', threadId '${threadId}'`)

    if (!this.isConnected) {
      throw new Exception("Could merge anything, the connection is down.", 'user')
    }

    if (typeof mergerKey !== 'string' || mergerKey.length === 0) {
      throw new Exception("Could not merge. You should privide a mergerKey.", 'user')
    }

    this._rest
      .post({
        path: 'thread.merger',
        headers: {
          'x-flowai-secret': this.secret
        },
        payload: {
          clientId: this._clientId,
          threadId: threadId || this.threadId,
          sessionId: sessionId || this.sessionId,
          mergerKey
        }
      })
      .then(result => {
        if (result.status !== 'ok') {
          throw new Error(`Unable to merge, received a status other then "ok". ${result.payload.message}`)
        }
      })
      .catch(err => {
        debug('Error while trying to merge', err)
        this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
      })
  }

  /**
   * Request historic messages
   * @param {string} threadId - Optional. Specify the threadId to retreive historic messages
   *
   * @example
   * // Load any messages if there is a threadId
   * // usefull when using with JS in the browser
   * client.history()
   *
   * // Load messages using a custom threadId
   * client.history('MY CUSTOM THREAD ID')
   **/
  history(threadId) {
    if (!threadId && !Unique.exists({
      clientId: this._clientId,
      key: 'threadId',
      engine: this._storage
    })) {
      return this.emit(LiveClient.NO_HISTORY)
    }

    this.log(`Updating threadId in history, this.threadId=${this.threadId}, threadId=${threadId}`)
    this.threadId = threadId

    this.emit(LiveClient.REQUESTING_HISTORY)

    this._rest
      .get({
        path: 'thread.history',
        headers: {
          'x-flowai-clientid': this._clientId,
          'x-flowai-threadid': this.threadId,
          'x-flowai-secret': this.secret
        }
      })
      .then(result => {
        if (result.status !== 'ok') {
          throw new Error(`Unable to fetch historic messages, received a status other then "ok". ${result.payload.message}`)
        }
        this.emit(LiveClient.RECEIVED_HISTORY, result.payload)
      })
      .catch(err => {
        debug('Error while trying to fetch the history', err)
        this.emit(LiveClient.ERROR, new Exception(
          new Error('Error while trying to fetch the history'),
          'history'
        ))
      })
  }

  /**
   * Call to mark a thread as noticed.
   * The library automatically throttles the number of calls
   * @param {string} threadId - Optional. Specify the thread that is noticed
   * @param {boolean} instantly - Optional. Instantly send notice. Default is false
   *
   * @example
   * // Call that the client has seen all messages for the auto clientId
   * client.noticed()
   *
   * // Mark messages based on a custom threadId
   * client.noticed('MY CUSTOM THREAD ID')
   **/
  noticed(threadId, instantly) {

    if (!threadId && !Unique.exists({
      clientId: this._clientId,
      key: 'threadId',
      engine: this._storage
    })) {
      // Skip
      throw new Exception("Could not send noticed. No threadId", 'user')
    }

    if (this._noticedTimeout) {
      // Skip this call (already one running)
      return
    }

    this._noticedTimeout = setTimeout(() => {
      this._noticedTimeout = null

      if (!this.isConnected) {
        throw new Exception("Could not send noticed message. The socket connection is disconnected.", 'user')
      }

      const enveloppe = JSON.stringify({
        type: 'thread.noticed',
        payload: {
          threadId: this.threadId
        }
      })

      debug(`Creating notice enveloppe`, enveloppe)
      try {
        if (this._socket) this._socket.send(enveloppe)
      } catch (err) {
        this.emit(LiveClient.ERROR, new Exception(err))
      }
    }, (instantly) ? 1 : 5000)
  }

  /**
   * Did we miss any messages?
   * @param {string} threadId - Optional. Specify the thread to check unnoticed messags for
   **/
  checkUnnoticed(threadId) {

    if (!threadId && !Unique.exists({
      clientId: this._clientId,
      key: 'threadId',
      engine: this._storage
    })) {
      return this.emit(LiveClient.CHECKED_UNNOTICED_MESSAGES, {
        unnoticed: false
      })
    }

    this.log(`Updating threadId in checkUnnoticed, this.threadId=${this.threadId}, threadId=${threadId}`)
    this.threadId = threadId

    this._rest
      .get({
        path: 'thread.unnoticed',
        headers: {
          'x-flowai-clientid': this._clientId,
          'x-flowai-threadid': this.threadId,
          'x-flowai-secret': this.secret
        }
      })
      .then(result => {
        if (result.status !== 'ok') {
          throw new Error(`Unable to check unnoticed messages, received a status other then "ok". ${result.payload.message}`)
        }

        this.emit(LiveClient.CHECKED_UNNOTICED_MESSAGES, result.payload)
      })
      .catch(err => {
        debug('Error while trying to find out unnoticed messages', err)
        this.emit(LiveClient.ERROR, new Exception(
          new Error('Error while trying to find out unnoticed messages'),
          'unnoticed'
        ))
      })
  }

  /**
   * 
   * @param {string} text 
   */
  log(text) {
    if (!this.isConnected || !this.debugLogs) {
      return
    }

    const enveloppe = JSON.stringify({
      type: 'log',
      payload: {
        text,
        threadId: this.threadId,
        clientId: this._clientId,
        previousThreadId: this._prevThreadId,
        sessionId: this.sessionId
      }
    })

    debug(`Creating user typing activity enveloppe`, enveloppe)

    setTimeout(() => {
      // We add a tiny delay because
      // messages instantly send after 'connection'
      // event get lost
      if (this._socket) this._socket.send(enveloppe)
    }, 50)
  }

  /**
   * Setup the client
   * @private
   **/
  _init() {
    this._session = null
    this._thread = null
    this._secret = null
    this._socket = null
    this._keepAliveInterval = null
    this._reconnectTimeout = null
    this._noticedTimeout = null
    this._backoff = new Backoff({ min: 100, max: 20000 })
  }

  /**
   * Try to reconnect
   * @private
   **/
  _reconnect() {
    if (!this._isAutoReconnect) {
      debug('Auto reconnect is disabled')
      return
    }

    const timeout = this._backoff.duration() + 1000
    debug(`Reconnecting with timeout in '${timeout}'ms`)

    this._reconnectTimeout = setTimeout(() => {
      this.emit(LiveClient.RECONNECTING)
      this._openConnection()
    }, timeout)
  }

  /**
   * Try to open a connection
   * @private
   **/
  _openConnection() {
    this._isAutoReconnect = true

    // Request endpoint to give a WS url
    this._rest
      .get({
        path: 'socket.info',
        headers: {
          'x-flowai-clientid': this._clientId,
          'x-flowai-sessionid': this.sessionId,
          'x-flowai-threadid': this.threadId,
          'x-flowai-secret': this.secret,
          'x-flowai-ott': this._ott
        }
      })
      .then(result => {
        if (result.status !== 'ok') {
          throw new Exception(`Unable to get a socket URL": ${result.payload.message}`, 'connection')
        }

        if (typeof result.secret === 'string') {
          this.secret = result.secret
        }

        this._handleConnection(result.payload)
      })
      .catch(err => {
        if (this._silent !== true) {
          console.error('LiveClient: Error while trying to connect', err)
        }

        if (!err.isFinal) {
          this._reconnect()
        }

        this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
      })
  }

  /**
   * Handle a received endpoint
   * @private
   **/
  _handleConnection(payload) {
    if (!payload) {
      throw new Error("Did not receive a valid response from the backend service")
    }

    let { endpoint } = payload

    debug(`Opening the connection with endpoint '${endpoint}'`)

    if (endpoint.includes('/debug')) {
      this.debugLogs = true
      endpoint = endpoint.replace('/debug', '')
    }

    const socket = new w3cwebsocket(endpoint, null, this._origin)

    socket.onopen = () => {
      debug('Socket onopen')

      this.emit(LiveClient.CONNECTED)

      // Clear any running interval
      clearInterval(this._keepAliveInterval)

      // Create a new Interval
      this._keepAliveInterval = this._keepAlive()

      this.log('Connection opened')
    }

    socket.onerror = evt => {
      const msg = "Failed socket operation."
      switch (socket.readyState) {
        case 0: {
          this.emit(LiveClient.ERROR, new Exception(`${msg} Socket is busy connecting.`, 'connection'))
          break
        }
        case 1: {
          this.emit(LiveClient.ERROR, new Exception(`${msg} Socket is connected.`, 'connection'))
          break
        }
        case 2: {
          this.emit(LiveClient.ERROR, new Exception(`${msg} Connection is busy closing.`, 'connection'))
          break
        }
        case 3: {
          this.emit(LiveClient.ERROR, new Exception(`${msg} Connection is closed.`, 'connection'))
          break
        }
        default: {
          this.emit(LiveClient.ERROR, new Exception(msg, 'connection'))
          break
        }
      }
    }

    socket.onclose = evt => {
      debug('Socket onclose', evt)

      this.log('Connection closed')

      this._socket = null

      if (evt && evt.code === 1006) {
        this.emit(LiveClient.ERROR, new Exception('The connection closed abnormally', 'connection', null, true))
        this.emit(LiveClient.DISCONNECTED)

        // DIRTY FIX? Need to check this in the future
        this._reconnect()
      } else if (evt && evt.reason !== 'connection failed') {
        this.emit(LiveClient.DISCONNECTED)
        this._reconnect()
      } else {
        this.emit(LiveClient.DISCONNECTED)
      }
    }

    socket.onmessage = evt => {
      debug('Socket onmessage')

      if (typeof evt.data !== 'string' || evt.data.length == 0) {
        this.emit(LiveClient.ERROR, new Exception('Failed to receive a valid websocet URL, please check the clientId', 'connection'))
        return
      }

      const {
        type,
        payload,
        message
      } = JSON.parse(evt.data)

      debug('Message received with type and payload', type, payload, message)

      switch (type) {
        case 'pong':
          // Ignore pongs
          break

        case 'agent.typing':
          this._handleReceivedAgentTyping(payload)
          break

        case 'message.received':
        case 'activities.created':
          this._handleReceived(payload)
          break

        case 'error':
          this.emit(LiveClient.ERROR, new Exception(message, 'connection'))
          break

        case 'message.delivered':
        case 'activities.delivered':
          this._handleDelivered(payload)
          break

        case 'secret.generated': {
          if (typeof message.secret === 'string') {
            this.secret = message.secret
          }
          break
        }

        case 'interruption.occurred': {
          this.log('Interruption occured')
          this._handleInterruptionOccurred()
          break
        }

        default: {
          debug('Unknow message received with type and payload', type, payload)
          this.emit(LiveClient.ERROR, new Exception(`Unknown message received ${evt.data}`, 'connection'))
        }
      }
    }

    this._socket = socket
  }

  /**
   * Handle a received message
   * @private
   * @param {object} payload
   **/
  _handleReceived(payload) {
    debug('Handling reply payload', payload)
    this.emit(LiveClient.REPLY_RECEIVED, new Reply(payload))
  }

  /**
   * Handle a interruption occurred message
   * @private
   * @param {object} payload
   **/
  _handleInterruptionOccurred() {
    this.emit(LiveClient.INTERRUPTION_OCCURRED, {})
  }

  _handleReceivedAgentTyping(payload) {
    debug('Handling agent typing payload', payload)
    this.emit(LiveClient.AGENT_TYPING_RECEIVED, payload)
  }

  /**
   * Handle a received delivery confirmation
   * @private
   * @param {object} payload
   **/
  _handleDelivered(payload) {
    debug('Handling delivered payload', payload)
    this.emit(LiveClient.MESSAGE_DELIVERED, Message.build(payload))
  }

  /**
   * Disconnnect
   * @private
   **/
  _closeConnection() {
    this._isAutoReconnect = false

    if (this._reconnectTimeout) {
      // Whenever we close the connection manually,
      // we kill any idle reconnect time outs
      clearTimeout(this._reconnectTimeout)
    }

    if (this._noticedTimeout) {
      // Whenever we close the connection manually,
      // we kill any noticed timers
      clearTimeout(this._noticedTimeout)
    }

    if (this._keepAliveInterval) {
      // Stop any keep alive intervals
      clearInterval(this._keepAliveInterval)
    }

    if (this.isConnected) {
      debug('Closing the socket')
      this._socket.close()
    } else {
      debug('No socket connection to close')
    }
  }

  /**
   * Send pings to keep the connection alive
   * @private
   **/
  _keepAlive() {
    return setInterval(() => {
      try {
        if (this.isConnected) {
          debug('Sending keep alive packet')
          this._socket.send(JSON.stringify({
            type: 'ping'
          }))
        }
      } catch (err) {
        if (this._silent !== true) {
          console.error('Error while sending a keepalive ping', err)
        }
      }
    }, 1000 * 25)
  }
}

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when an error is received from the flow.ai platform
 **/
LiveClient.ERROR = 'ERROR'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when client is connected with platform
 **/
LiveClient.CONNECTED = 'connected'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when client tries to reconnect
 **/
LiveClient.RECONNECTING = 'reconnecting'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when the client gets disconnected
 **/
LiveClient.DISCONNECTED = 'disconnected'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when a new message is received from the platform
 **/
LiveClient.REPLY_RECEIVED = 'message.received'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when start busy typing received from the platform
 **/
LiveClient.AGENT_TYPING_RECEIVED = 'agent.typing'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when the client is sending a message to the platform
 **/
LiveClient.MESSAGE_SEND = 'message.send'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when the send message has been received by the platform
 **/
LiveClient.MESSAGE_DELIVERED = 'message.delivered'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when a request is made to load historic messages
 **/
LiveClient.REQUESTING_HISTORY = 'requesting.history'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when a request is made to load historic messages
 **/
LiveClient.NO_HISTORY = 'no.history'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when historic messages are received
 **/
LiveClient.RECEIVED_HISTORY = 'received.history'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when there are unnoticed messages
 **/
LiveClient.CHECKED_UNNOTICED_MESSAGES = 'unnoticed.messages'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when there are unnoticed messages
 **/
LiveClient.INTERRUPTION_OCCURRED = 'interruption.occurred'

export default LiveClient
