'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _backo = require('backo');

var _backo2 = _interopRequireDefault(_backo);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _websocket = require('websocket');

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _reply = require('./reply');

var _reply2 = _interopRequireDefault(_reply);

var _rest = require('./rest');

var _rest2 = _interopRequireDefault(_rest);

var _unique = require('./unique');

var _unique2 = _interopRequireDefault(_unique);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _debug2.default)('flowai:liveclient');

/**
 * Live streaming websocket client extends EventEmitter
 * @class
 **/

var LiveClient = function (_EventEmitter) {
  _inherits(LiveClient, _EventEmitter);

  /**
   * Constructor
   * @param {string|object} opts - Configuration options or shorthand for just clientId
   * @param {string} opts.clientId - Mandatory Client token
   * @param {string} opts.storage=local - Optional, 'session' or 'local' for using sessionStorage or localStorage
   * @param {string} opts.endpoint - Optional, only for testing purposes
   * @returns {LiveClient}
   */
  function LiveClient(opts) {
    _classCallCheck(this, LiveClient);

    // Backwards compatibility
    var _this = _possibleConstructorReturn(this, (LiveClient.__proto__ || Object.getPrototypeOf(LiveClient)).call(this));

    if (typeof opts === 'string') {
      _this._clientId = arguments[0];

      if (arguments.length == 2) {
        _this._endpoint = arguments[1];
      }
    } else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
      _this._clientId = opts.clientId;
      _this._endpoint = opts.endpoint;

      if (opts.storage === 'session') {
        _this._storage = 'session';
      } else {
        _this._storage = 'local';
      }
    }

    if (typeof _this._clientId !== 'string') {
      throw new _exception2.default("Invalid or lacking argument for LiveClient. You must provide a Client Id. Check the dashboard.", 'user');
    }

    _this._storage = _this._storage || 'local';
    _this._endpoint = _this._endpoint || 'https://api.flow.ai';
    _this._rest = new _rest2.default(_this._endpoint);
    _this._init();

    (0, _debug2.default)('Constructed a new LiveClient', _this);
    return _this;
  }

  /**
   * Session Id of the connection
   * @returns {string|null} Null if no connection is active
   **/


  _createClass(LiveClient, [{
    key: 'start',


    /**
     * Start the client
     * @param {string} threadId - Optional. When assigned, this is the default threadId for all messages that are send
     * @param {string} sessionId - Optional. Must be unique for every connection
     **/
    value: function start(threadId, sessionId) {
      try {

        if (sessionId && typeof sessionId !== 'string') {
          throw new _exception2.default("sessionId must be a string", 'user');
        }

        if (threadId && typeof threadId !== 'string') {
          throw new _exception2.default("threadId must be a string", 'user');
        }

        (0, _debug2.default)('Starting the client with sessionId ' + sessionId + ' and threadId \'' + threadId + '\'');

        // Create a new backoff policy
        this._backoff = new _backo2.default({ min: 100, max: 20000 });

        // Create a new Thread
        this.sessionId = sessionId;

        // Create a new Thread
        this.threadId = threadId;

        this._openConnection();
      } catch (err) {
        // Wrap the error
        throw new _exception2.default('Failed to start the client ' + err, 'connection', err);
      }
    }

    /**
     * Stop the client
     * @desc Use this method to temp disconnect a client
     **/

  }, {
    key: 'stop',
    value: function stop() {
      try {
        (0, _debug2.default)('Stopping the client');
        this._closeConnection();
      } catch (err) {
        // Wrap the error
        throw new _exception2.default("Failed to stop the client", 'connection', err);
      }
    }

    /**
     * Close the connection and completely reset the client
     **/

  }, {
    key: 'destroy',
    value: function destroy() {
      this._closeConnection();
      this._init();
    }

    /**
     * Send a Message
     * @desc This method triggers a `LiveClient.MESSAGE_SEND` event
     * @param {Message} message - Message to be send
     * @returns Message - Message that was send
     **/

  }, {
    key: 'send',
    value: function send(message) {
      var _this2 = this;

      (0, _debug2.default)('Sending message', message);

      if (!this.isConnected) {
        throw new _exception2.default("Could not send the message. The socket connection is disconnected.", 'user');
      }

      if (!(message instanceof _message2.default)) {
        throw new _exception2.default("Could not send the message. You should send a valid Message object.", 'user');
      }

      // Set the default
      message.threadId = message.threadId || this.threadId;

      // Update threadId
      this.threadId = message.threadId;

      var enveloppe = JSON.stringify({
        type: 'message.send',
        payload: message
      });

      (0, _debug2.default)('Creating message enveloppe', enveloppe);

      try {
        this.emit(LiveClient.MESSAGE_SEND, message);
        setTimeout(function () {
          // We add a tiny delay because
          // messages instantly send after 'connection'
          // event get lost
          _this2._socket.send(enveloppe);
        }, 50);
      } catch (err) {
        this.emit(LiveClient.ERROR, new _exception2.default(err));
      }

      return message;
    }

    /**
     * Merge two threads from different channels.
     * This methods is not yet publicy supported since we don't have a way yet to provide a mergerKey.
     * @param {string} mergerKey - Unique token representing merge Request
     * @param {string} threadId - Optional. The threadId to merge
     * @param {string} sessionId - Optional. The sessionId to assign to the thread
     **/

  }, {
    key: 'merger',
    value: function merger(mergerKey, threadId, sessionId) {
      var _this3 = this;

      (0, _debug2.default)('Merging threads \'' + mergerKey + '\', threadId \'' + threadId + '\'');

      if (!this.isConnected) {
        throw new _exception2.default("Could merge anything, the connection is down.", 'user');
      }

      if (typeof mergerKey !== 'string' || mergerKey.length === 0) {
        throw new _exception2.default("Could not merge. You should privide a mergerKey.", 'user');
      }

      this._rest.post({
        path: 'thread.merger',
        payload: {
          clientId: this._clientId,
          threadId: threadId || this.threadId,
          sessionId: sessionId || this.sessionId,
          mergerKey: mergerKey
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new Error('Unable to merge, received a status other then "ok". ' + result.payload.message);
        }
      }).catch(function (err) {
        (0, _debug2.default)('Error while trying to merge', err);
        _this3.emit(LiveClient.ERROR, new _exception2.default(err, 'connection'));
      });
    }

    /**
     * Request historic messages
     * @param {string} threadId - Optional. Specify the thread to retreive historic messages
     **/

  }, {
    key: 'history',
    value: function history(threadId) {
      var _this4 = this;

      if (!threadId && !_unique2.default.exists({
        clientId: this._clientId,
        label: 'threadId',
        engine: this._storage
      })) {
        return this.emit(LiveClient.NO_HISTORY);
      }

      this.threadId = threadId;

      this.emit(LiveClient.REQUESTING_HISTORY);

      this._rest.get({
        path: 'thread.history',
        queryParams: {
          clientId: this._clientId,
          threadId: this.threadId
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new Error('Unable to fetch historic messages, received a status other then "ok". ' + result.payload.message);
        }
        _this4.emit(LiveClient.RECEIVED_HISTORY, result.payload);
      }).catch(function (err) {
        (0, _debug2.default)('Error while trying to fetch the history', err);
        _this4.emit(LiveClient.ERROR, new _exception2.default(err, 'connection'));
      });
    }

    /**
     * Call to mark a thread as noticed.
     * The library automatically throttles the number of calls
     * @param {string} threadId - Optional. Specify the thread that is noticed
     * @param {bool} instantly - Optional. Instantly send notice. Default is false
     **/

  }, {
    key: 'noticed',
    value: function noticed(threadId, instantly) {
      var _this5 = this;

      if (!threadId && !_unique2.default.exists({
        clientId: this._clientId,
        label: 'threadId',
        engine: this._storage
      })) {
        // Skip
        throw new _exception2.default("Could not send noticed. No threadId", 'user');
      }

      if (this._noticedTimeout) {
        // Skip this call (already one running)
        return;
      }

      this._noticedTimeout = setTimeout(function () {
        _this5._noticedTimeout = null;

        if (!_this5.isConnected) {
          throw new _exception2.default("Could not send noticed message. The socket connection is disconnected.", 'user');
        }

        var enveloppe = JSON.stringify({
          type: 'thread.noticed',
          payload: {
            threadId: _this5.threadId
          }
        });

        (0, _debug2.default)('Creating notice enveloppe', enveloppe);
        try {
          _this5._socket.send(enveloppe);
        } catch (err) {
          _this5.emit(LiveClient.ERROR, new _exception2.default(err));
        }
      }, instantly ? 1 : 5000);
    }

    /**
     * Did we miss any messages?
     * @param {string} threadId
     **/

  }, {
    key: 'checkUnnoticed',
    value: function checkUnnoticed(threadId) {
      var _this6 = this;

      if (!threadId && !_unique2.default.exists({
        clientId: this._clientId,
        label: 'threadId',
        engine: this._storage
      })) {
        return this.emit(LiveClient.CHECKED_UNNOTICED_MESSAGES, {
          unnoticed: false
        });
      }

      this.threadId = threadId;

      this._rest.get({
        path: 'thread.unnoticed',
        queryParams: {
          clientId: this._clientId,
          threadId: this.threadId
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new Error('Unable to check unnoticed messages, received a status other then "ok". ' + result.payload.message);
        }

        _this6.emit(LiveClient.CHECKED_UNNOTICED_MESSAGES, result.payload);
      }).catch(function (err) {
        (0, _debug2.default)('Error while trying to find out unnoticed messages', err);
        _this6.emit(LiveClient.ERROR, new _exception2.default(err, 'connection'));
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      this._session = null;
      this._thread = null;
      this._socket = null;
      this._keepAliveInterval = null;
      this._reconnectTimeout = null;
      this._noticedTimeout = null;
      this._backoff = new _backo2.default({ min: 100, max: 20000 });
    }
  }, {
    key: '_reconnect',
    value: function _reconnect() {
      var _this7 = this;

      if (!this._isAutoReconnect) {
        (0, _debug2.default)('Auto reconnect is disabled');
        return;
      }

      var timeout = this._backoff.duration() + 1000;
      (0, _debug2.default)('Reconnecting with timeout in \'' + timeout + '\'ms');

      this._reconnectTimeout = setTimeout(function () {
        _this7.emit(LiveClient.RECONNECTING);
        _this7._openConnection();
      }, timeout);
    }
  }, {
    key: '_openConnection',
    value: function _openConnection() {
      var _this8 = this;

      this._isAutoReconnect = true;

      // Request endpoint to give a WS url
      this._rest.get({
        path: 'socket.info',
        queryParams: {
          clientId: this._clientId,
          sessionId: this.sessionId,
          threadId: this.threadId
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new Error('Unable to create get a socket URL, received a status other then "ok". ' + result.payload.message);
        }
        _this8._handleConnection(result.payload);
      }).catch(function (err) {
        (0, _debug2.default)('Error while trying to connect', err);
        _this8._reconnect();

        _this8.emit(LiveClient.ERROR, new _exception2.default(err, 'connection'));
      });
    }
  }, {
    key: '_handleConnection',
    value: function _handleConnection(payload) {
      var _this9 = this;

      if (!payload) {
        throw new Error("Did not receive a valid response from the backend service");
      }

      var endpoint = payload.endpoint;


      (0, _debug2.default)('Opening the connection with endpoint \'' + endpoint + '\'');

      var socket = new _websocket.w3cwebsocket(endpoint, null);

      socket.onopen = function () {
        (0, _debug2.default)('Socket onopen');

        _this9.emit(LiveClient.CONNECTED);

        // Clear any running interval
        clearInterval(_this9._keepAliveInterval);

        // Create a new Interval
        _this9._keepAliveInterval = _this9._keepAlive();
      };

      socket.onerror = function (err) {
        (0, _debug2.default)('Socket onerror', err);
        _this9.emit(LiveClient.ERROR, new _exception2.default(err, 'connection'));
      };

      socket.onclose = function () {
        (0, _debug2.default)('Socket onclose');
        _this9._socket = null;
        _this9.emit(LiveClient.DISCONNECTED);
        _this9._reconnect();
      };

      socket.onmessage = function (evt) {
        (0, _debug2.default)('Socket onmessage');

        if (typeof evt.data !== 'string' || evt.data.length == 0) {
          _this9.emit(LiveClient.ERROR, new _exception2.default('Failed to receive a valid websocet URL, please check the clientId', 'connection'));
          return;
        }

        var _JSON$parse = JSON.parse(evt.data),
            type = _JSON$parse.type,
            payload = _JSON$parse.payload,
            message = _JSON$parse.message;

        (0, _debug2.default)('Message received with type and payload', type, payload, message);

        switch (type) {
          case 'pong':
            // Ignore pongs
            break;

          case 'message.received':
          case 'activities.created':
            _this9._handleReceived(payload);
            break;

          case 'error':
            _this9.emit(LiveClient.ERROR, new _exception2.default(message, 'connection'));
            break;

          case 'message.delivered':
          case 'activities.delivered':
            _this9._handleDelivered(payload);
            break;

          default:
            {
              (0, _debug2.default)('Unknow message received with type and payload', type, payload);
              _this9.emit(LiveClient.ERROR, new _exception2.default('Unknown message received ' + evt.data, 'connection'));
            }
        }
      };

      this._socket = socket;
    }
  }, {
    key: '_handleReceived',
    value: function _handleReceived(payload) {
      (0, _debug2.default)('Handling reply payload', payload);
      this.emit(LiveClient.REPLY_RECEIVED, new _reply2.default(payload));
    }
  }, {
    key: '_handleDelivered',
    value: function _handleDelivered(payload) {
      (0, _debug2.default)('Handling delivered payload', payload);
      this.emit(LiveClient.MESSAGE_DELIVERED, _message2.default.build(payload));
    }
  }, {
    key: '_closeConnection',
    value: function _closeConnection() {
      this._isAutoReconnect = false;

      if (this._reconnectTimeout) {
        // Whenever we close the connection manually,
        // we kill any idle reconnect time outs
        clearTimeout(this._reconnectTimeout);
      }

      if (this._noticedTimeout) {
        // Whenever we close the connection manually,
        // we kill any noticed timers
        clearTimeout(this._noticedTimeout);
      }

      if (this._keepAliveInterval) {
        // Stop any keep alive intervals
        clearInterval(this._keepAliveInterval);
      }

      if (this.isConnected) {
        (0, _debug2.default)('Closing the socket');
        this._socket.close();
      } else {
        (0, _debug2.default)('No socket connection to close');
      }
    }
  }, {
    key: '_keepAlive',
    value: function _keepAlive() {
      var _this10 = this;

      return setInterval(function () {
        try {
          if (_this10.isConnected) {
            (0, _debug2.default)('Sending keep alive packet');
            _this10._socket.send(JSON.stringify({
              type: 'ping'
            }));
          }
        } catch (err) {
          (0, _debug2.default)('Error while sending a keepalive ping', err);
        }
      }, 1000 * 25);
    }
  }, {
    key: 'sessionId',
    get: function get() {
      var sessionId = this._session ? this._session.id() : null;

      (0, _debug2.default)('sessionId is \'' + sessionId + '\'');

      return sessionId;
    },
    set: function set(value) {
      this._session = new _unique2.default({
        clientId: this._clientId,
        key: 'sessionId',
        value: value,
        engine: this._storage
      });
    }

    /**
     * Default Thread Id to be used for any messages being send
     * @returns {string|null} Null if no connection is active
     **/

  }, {
    key: 'threadId',
    get: function get() {
      var threadId = this._thread ? this._thread.id() : null;

      (0, _debug2.default)('threadId is \'' + threadId + '\'');

      return threadId;
    },
    set: function set(value) {
      // Create a new Thread
      this._thread = new _unique2.default({
        clientId: this._clientId,
        key: 'threadId',
        value: value,
        engine: this._storage
      });
    }

    /**
     * Check if the connection is active
     * @returns {bool} True if the connection is active
     **/

  }, {
    key: 'isConnected',
    get: function get() {
      var isConnected = this._socket !== null;

      (0, _debug2.default)('isConnected is \'' + isConnected + '\'');

      return isConnected;
    }
  }]);

  return LiveClient;
}(_events2.default);

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when an error is received from the flow.ai platform
 **/


LiveClient.ERROR = 'error';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when client is connected with platform
 **/
LiveClient.CONNECTED = 'connected';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when client tries to reconnect
 **/
LiveClient.RECONNECTING = 'reconnecting';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when the client gets disconnected
 **/
LiveClient.DISCONNECTED = 'disconnected';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when a new message is received from the platform
 **/
LiveClient.REPLY_RECEIVED = 'message.received';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when the client is sending a message to the platform
 **/
LiveClient.MESSAGE_SEND = 'message.send';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when the send message has been received by the platform
 **/
LiveClient.MESSAGE_DELIVERED = 'message.delivered';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when a request is made to load historic messages
 **/
LiveClient.REQUESTING_HISTORY = 'requesting.history';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when a request is made to load historic messages
 **/
LiveClient.NO_HISTORY = 'no.history';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when historic messages are received
 **/
LiveClient.RECEIVED_HISTORY = 'received.history';

/**
 * @constant
 * @type {string}
 * @desc Event that triggers when there are unnoticed messages
 **/
LiveClient.CHECKED_UNNOTICED_MESSAGES = 'unnoticed.messages';

exports.default = LiveClient;