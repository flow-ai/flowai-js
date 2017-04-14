import EventEmitter from 'events'
import Backoff from 'backo'
import debug from 'debug'
import { w3cwebsocket } from 'websocket'
import Message from './message'
import Reply from './reply'
import Rest from './rest'
import Unique from './unique'
import Exception from './exception'


debug('flowai:liveclient')

/**
 * Live streaming websocket client extends EventEmitter
 * @class
 **/
class LiveClient extends EventEmitter {

/**
 * Constructor
 * @param {string} clientId - Client token
 * @param {string} endpoint - For testing purposes
 * @returns {LiveClient}
 */
  constructor(clientId, endpoint) {

    if(typeof(clientId) !== 'string') {
      throw new Exception("Invalid or lacking argument for LiveClient. You must provide a Client Id. Check the dashboard.", 'user')
    }

    super()

    this._clientId = clientId
    this._endpoint = endpoint || 'https://api.flow.ai/channels/webclient/api'
    this._rest = new Rest(this._endpoint)
    this._init()

    debug('Constructed a new LiveClient', this)
  }

  /**
   * Session Id of the connection
   * @returns {string|null} Null if no connection is active
   **/
  get sessionId() {
    const sessionId = (this._session) ? this._session.id() : null

    debug(`sessionId is '${sessionId}'`)

    return sessionId
  }

  set sessionId(value) {
    this._session = new Unique('sessionId', value)
  }

  /**
   * Default Thread Id to be used for any messages being send
   * @returns {string|null} Null if no connection is active
   **/
  get threadId() {
    const threadId = (this._thread) ? this._thread.id() : null

    debug(`threadId is '${threadId}'`)

    return threadId
  }

  set threadId(value) {
    // Create a new Thread
    this._thread = new Unique('threadId', value)
  }

  /**
   * Check if the connection is active
   * @returns {bool} True if the connection is active
   **/
  get isConnected() {
    const isConnected = (this._socket !== null)

    debug(`isConnected is '${isConnected}'`)

    return isConnected
  }

  /**
   * Start the client
   * @param {string} threadId - Optional. When assigned, this is the default threadId for all messages that are send
   * @param {string} sessionId - Optional. Must be unique for every connection
   **/
  start(threadId, sessionId) {
    try {

      if(sessionId && typeof(sessionId) !== 'string') {
        throw new Exception("sessionId must be a string", 'user')
      }

      if(threadId && typeof(threadId) !== 'string') {
        throw new Exception("threadId must be a string", 'user')
      }

      debug(`Starting the client with sessionId ${sessionId} and threadId '${threadId}'`)

      // Create a new backoff policy
      this._backoff = new Backoff({ min: 100, max: 20000 })

      // Create a new Thread
      this.sessionId = sessionId

      // Create a new Thread
      this.threadId = threadId

      this._openConnection()

    } catch(err) {
      // Wrap the error
      throw new Exception("Failed to start the client", 'connection', err)
    }
  }

  /**
   * Stop the client
   * @desc Use this method to temp disconnect a client
   **/
  stop() {
    try {
      debug(`Stopping the client`)
      this._closeConnection()
    } catch(err) {
      // Wrap the error
      throw new Exception("Failed to stop the client", 'connection', err)
    }
  }

  /**
   * Close the connection and completely reset the client
   **/
  destroy() {
    this._closeConnection()
    this._init()
  }

  /**
   * Send a Message
   * @desc This method triggers a `LiveClient.MESSAGE_SEND` event
   * @param {Message} message - Message to be send
   * @returns Message - Message that was send
   **/
  send(message) {

    debug(`Sending message`, message)

    if(!this.isConnected) {
      throw new Exception("Could not send the message. The socket connection is disconnected.", 'user')
    }

    if(!(message instanceof Message)) {
      throw new Exception("Could not send the message. You should send a valid Message object.", 'user')
    }

    // Set the default
    message.threadId = message.threadId || this.threadId

    // Update threadId
    this.threadId = message.threadId

    const enveloppe = JSON.stringify({
      type: 'message.send',
      payload: message
    })

    debug(`Creating message enveloppe`, enveloppe)

    try {
      this.emit(LiveClient.MESSAGE_SEND, message)
      setTimeout(() => {
        // We add a tiny delay because
        // messages instantly send after 'connection'
        // event get lost
        this._socket.send(enveloppe)
      }, 50)

    } catch(err) {
      this.emit(LiveClient.ERROR, new Exception(err))
    }

    return message
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

    if(!this.isConnected) {
      throw new Exception("Could merge anything, the connection is down.", 'user')
    }

    if(typeof mergerKey !== 'string' || mergerKey.length === 0) {
      throw new Exception("Could not merge. You should privide a mergerKey.", 'user')
    }

    this._rest
      .post({
        path: 'thread.merger',
        payload: {
          clientId: this._clientId,
          threadId: threadId || this.threadId,
          sessionId: sessionId || this.sessionId,
          mergerKey
        }
      })
      .then((result) => {
        if(result.status !== 'ok') {
          throw new Error('Unable to merge, received a status other then "ok"')
        }
      })
      .catch((err) => {
        debug('Error while trying to merge', err)
        this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
      })
  }

  /**
   * Request historic messages
   * @param {string} threadId - Optional. Specify the thread to retreive historic messages
   **/
  history(threadId) {
    if(!this.isConnected) {
      throw new Exception("Could not load any historic information", 'user')
    }

    if(!threadId && !this.threadId) {
      // No history to be loaded
      this.emit(LiveClient.NO_HISTORY)
      return
    }

    this.emit(LiveClient.REQUESTING_HISTORY)

    this._rest
      .get({
        path: 'thread.history',
        queryParams: {
          clientId: this._clientId,
          threadId: threadId || this.threadId
        }
      })
      .then((result) => {
        if(result.status !== 'ok') {
          throw new Error('Unable to merge, received a status other then "ok"')
        }
        this.emit(LiveClient.RECEIVED_HISTORY, result.payload)
      })
      .catch((err) => {
        debug('Error while trying to merge', err)
        this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
      })
  }

  /**
   * Call to mark a thread as noticed.
   * The library automatically throttles the number of calls
   * @param {string} threadId - Optional. Specify the thread that is noticed
   * @param {bool} instantly - Optional. Instantly send notice. Default is false
   **/
  noticed(threadId, instantly) {

    if(!threadId && !this.threadId) {
      // Skip
      throw new Exception("Could not send noticed. No threadId", 'user')
    }

    if(this._noticedTimeout) {
      // Skip this call (already one running)
      return
    }

    this._noticedTimeout = setTimeout(() => {
      this._noticedTimeout = null

      if(!this.isConnected) {
        throw new Exception("Could not send noticed message. The socket connection is disconnected.", 'user')
      }

      const enveloppe = JSON.stringify({
        type: 'thread.noticed',
        payload: {
          threadId: threadId || this.threadId
        }
      })

      debug(`Creating notice enveloppe`, enveloppe)
      try {
        this._socket.send(enveloppe)
      } catch(err) {
        this.emit(LiveClient.ERROR, new Exception(err))
      }
    }, (instantly) ? 1 : 5000)
  }

  /**
   * Did we miss any messages?
   * @param {string} threadId
   **/
  checkUnnoticed(threadId) {

    if(!threadId && !this.threadId) {
      return
    }

    this._rest
      .get({
        path: 'thread.unnoticed',
        queryParams: {
          clientId: this._clientId,
          threadId: threadId || this.threadId
        }
      })
      .then((result) => {
        if(result.status !== 'ok') {
          throw new Error('Unable to send a notice, received a status other then "ok"')
        }

        if(result.payload.unnoticed){
          this.emit(LiveClient.UNNOTICED_MESSAGES)
        }
      })
      .catch((err) => {
        debug('Error while trying to find out unnoticed messages', err)
        this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
      })
  }

  _init() {
    this._session= null
    this._thread = null
    this._socket = null
    this._connection = null
    this._keepAliveInterval = null
    this._reconnectTimeout = null
    this._noticedTimeout = null
    this._backoff = new Backoff({ min: 100, max: 20000 })
  }

  _reconnect() {
    if(!this._isAutoReconnect) {
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

  _openConnection() {

    this._isAutoReconnect = true

    // Request endpoint to give a WS url
    this._rest
      .get({
        path: 'socket.info',
        queryParams: {
          clientId: this._clientId,
          sessionId: this.sessionId
        }
      })
      .then(({ payload }) => this._handleConnection(payload))
      .catch((err) => {
        debug('Error while trying to connect', err)
        this._reconnect()

        this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
      })
  }

  _handleConnection(payload) {
    if( !payload ) {
      throw new Error("Did not receive a valid response from the backend service")
    }

    const { endpoint } = payload

    debug(`Opening the connection with endpoint '${endpoint}'`)

    const socket = new w3cwebsocket(endpoint, null)

    socket.onopen = () => {
      debug('Socket onopen')

      this.emit(LiveClient.CONNECTED)

      // Clear any running interval
      clearInterval(this._keepAliveInterval)

      // Create a new Interval
      this._keepAliveInterval = this._keepAlive()
    }

    socket.onerror = (err) => {
      debug('Socket onerror', err)
      this.emit(LiveClient.ERROR, new Exception(err, 'connection'))
    }

    socket.onclose = () => {
      debug('Socket onclose')
      this._socket = null
      this.emit(LiveClient.DISCONNECTED)
      this._reconnect()
    }

    socket.onmessage = (evt) => {
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

      switch(type) {
        case 'pong':
          // Ignore pongs
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

        default: {
          debug('Unknow message received with type and payload', type, payload)
          this.emit(LiveClient.ERROR, new Exception(`Unknown message received ${evt.data}`, 'connection'))
        }
      }
    }

    this._socket = socket
  }

  _handleReceived(payload) {
    debug('Handling reply payload', payload)
    this.emit(LiveClient.REPLY_RECEIVED, new Reply(payload))
  }

  _handleDelivered(payload) {
    debug('Handling delivered payload', payload)
    this.emit(LiveClient.MESSAGE_DELIVERED, new Message(payload))
  }

  _closeConnection() {
    this._isAutoReconnect = false

    if(this._reconnectTimeout) {
      // Whenever we close the connection manually,
      // we kill any idle reconnect time outs
      clearTimeout(this._reconnectTimeout)
    }

    if(this._noticedTimeout) {
      // Whenever we close the connection manually,
      // we kill any noticed timers
      clearTimeout(this._noticedTimeout)
    }

    if(this._keepAliveInterval) {
      // Stop any keep alive intervals
      clearInterval(this._keepAliveInterval)
    }

    if(this.isConnected) {
      debug('Closing the socket')
      this._socket.close()
    } else {
      debug('No socket connection to close')
    }
  }

  _keepAlive() {
    return setInterval(() => {
      try {
        if(this.isConnected) {
          debug('Sending keep alive packet')
          this._socket.send(JSON.stringify({
            type: 'ping'
          }))
        }
      } catch(err) {
        debug('Error while sending a keepalive ping', err)
      }
    }, 1000 * 25)
  }
}

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when an error is received from the flow.ai platform
 **/
LiveClient.ERROR = 'error'

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when client is connected with platform
 **/
LiveClient.CONNECTED ='connected'

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
LiveClient.UNNOTICED_MESSAGES = 'unnoticed.messages'

export default LiveClient
