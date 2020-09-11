"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _backo = _interopRequireDefault(require("backo"));

var _debug = _interopRequireDefault(require("debug"));

var _websocket = require("websocket");

var _message = _interopRequireDefault(require("./message"));

var _reply = _interopRequireDefault(require("./reply"));

var _rest = _interopRequireDefault(require("./rest"));

var _unique = _interopRequireDefault(require("./unique"));

var _exception = _interopRequireDefault(require("./exception"));

var _fileAttachment = _interopRequireDefault(require("./file-attachment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

(0, _debug.default)('flowai:liveclient');
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

var LiveClient =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(LiveClient, _EventEmitter);

  /**
   * Constructor
   * @constructor
   * @param {(object|string)} opts - Configuration options or shorthand for just clientId
   * @param {string} opts.clientId - Mandatory Client token
   * @param {string} opts.storage - Optional, 'session' for using sessionStorage, 'local' for localStorage or `memory` for a simple memory store
   * @param {string} opts.endpoint - Optional, only for testing purposes
   * @param {string} opts.origin - When running on Nodejs you MUST set the origin
   * @param {boolean} opts.silent - Optional, console.errors will not be shown
   * @returns {LiveClient}
   *
   */
  function LiveClient(opts) {
    var _this;

    _classCallCheck(this, LiveClient);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LiveClient).call(this)); // Backwards compatibility

    if (typeof opts === 'string') {
      _this._clientId = arguments[0];

      if (arguments.length == 2) {
        _this._endpoint = arguments[1];
      }
    } else if (_typeof(opts) === 'object') {
      _this._clientId = opts.clientId;
      _this._endpoint = opts.endpoint;

      if (opts.storage === 'session') {
        _this._storage = 'session';
      } else {
        _this._storage = 'local';
      }

      if (typeof opts.silent === 'boolean') {
        _this._silent = opts.silent;
      } else {
        _this._silent = false;
      }

      if (typeof window === 'undefined') {
        _this._origin = opts.origin || undefined;
      }
    }

    if (typeof _this._clientId !== 'string') {
      throw new _exception.default("Invalid or lacking argument for LiveClient. You must provide a clientId. Check the dashboard", 'user');
    }

    _this._storage = _this._storage || 'local';
    _this._endpoint = _this._endpoint || 'https://sdk.flow.ai';
    _this._rest = new _rest.default(_this._endpoint, _this._silent);

    _this._init();

    (0, _debug.default)('Constructed a new LiveClient', _assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /**
   * Session Id of the connection
   * @method
   * @returns {?string} Null if no connection is active
   **/


  _createClass(LiveClient, [{
    key: "start",

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
    value: function start(threadId, sessionId) {
      try {
        if (sessionId && typeof sessionId !== 'string') {
          throw new _exception.default("sessionId must be a string", 'user');
        }

        if (threadId && typeof threadId !== 'string') {
          throw new _exception.default("threadId must be a string", 'user');
        }

        (0, _debug.default)("Starting the client with sessionId ".concat(sessionId, " and threadId '").concat(threadId, "'")); // Create a new backoff policy

        this._backoff = new _backo.default({
          min: 100,
          max: 20000
        }); // Create a new Thread

        this.sessionId = sessionId; // Create a new Thread

        this.threadId = threadId;

        this._openConnection();
      } catch (err) {
        // Wrap the error
        throw new _exception.default("Failed to start the client ".concat(err), 'connection', err);
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

  }, {
    key: "stop",
    value: function stop() {
      try {
        (0, _debug.default)("Stopping the client");

        this._closeConnection();
      } catch (err) {
        // Wrap the error
        throw new _exception.default("Failed to stop the client", 'connection', err);
      }
    }
    /**
     * Close the connection and completely reset the client
     *
     * @example
     * // Close the connection and reset the client
     * client.destroy()
     **/

  }, {
    key: "destroy",
    value: function destroy() {
      this._closeConnection();

      this._init();
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

  }, {
    key: "send",
    value: function send(message) {
      var _this2 = this;

      (0, _debug.default)("Sending message", message);

      if (!this.isConnected) {
        throw new _exception.default("Could not send the message. The socket connection is disconnected.", 'user');
      }

      if (!(message instanceof _message.default)) {
        throw new _exception.default("Could not send the message. You should send a valid Message object.", 'user');
      } // Set the default


      message.threadId = message.threadId || this.threadId; // Update threadId

      this.threadId = message.threadId;

      try {
        this.emit(LiveClient.MESSAGE_SEND, message);

        if (message.attachment && message.attachment instanceof _fileAttachment.default) {
          var formData = message.attachment.payload.formData;
          formData.append('payload', JSON.stringify(Object.assign({}, message, {
            attachment: undefined,
            clientId: this._clientId,
            sessionId: this.sessionId
          })));
          (0, _debug.default)('Uploading formData', formData);

          this._rest.upload(formData).then(function (result) {
            if (result.status !== 'ok') {
              _this2.emit(LiveClient.ERROR, new _exception.default(new Error('Failed to upload file.'), 'connection'));
            } else {
              _this2.emit(LiveClient.MESSAGE_DELIVERED, result.payload);
            }
          }).catch(function (err) {
            (0, _debug.default)('Error while trying to upload a file', err);

            _this2.emit(LiveClient.ERROR, new _exception.default(err, 'connection'));
          });

          return message;
        }

        var enveloppe = JSON.stringify({
          type: 'message.send',
          payload: message
        });
        (0, _debug.default)("Creating message enveloppe", enveloppe);
        setTimeout(function () {
          // We add a tiny delay because
          // messages instantly send after 'connection'
          // event get lost
          _this2._socket.send(enveloppe);
        }, 50);
      } catch (err) {
        this.emit(LiveClient.ERROR, new _exception.default(err));
      }

      return message;
    }
  }, {
    key: "sendUserTypingActivity",
    value: function sendUserTypingActivity(params) {
      var _this3 = this;

      (0, _debug.default)("Sending user typing activity");

      if (!this.isConnected) {
        throw new _exception.default("Could not send the user typing activity. The socket connection is disconnected.", 'user');
      }

      try {
        var originator = params && params.originator || {};
        var enveloppe = JSON.stringify({
          type: 'activity.user.typing',
          payload: {
            clientId: this._clientId,
            threadId: this.threadId,
            originator: originator
          }
        });
        (0, _debug.default)("Creating user typing activity enveloppe", enveloppe);
        setTimeout(function () {
          // We add a tiny delay because
          // messages instantly send after 'connection'
          // event get lost
          _this3._socket.send(enveloppe);
        }, 50);
      } catch (err) {
        this.emit(LiveClient.ERROR, new _exception.default(err));
      }
    }
    /**
     * Merge two threads from different channels.
     * This methods is not yet publicy supported since we don't have a way yet to provide a mergerKey.
     * @param {string} mergerKey - Unique token representing merge Request
     * @param {string} threadId - Optional. The threadId to merge
     * @param {string} sessionId - Optional. The sessionId to assign to the thread
     **/

  }, {
    key: "merger",
    value: function merger(mergerKey, threadId, sessionId) {
      var _this4 = this;

      (0, _debug.default)("Merging threads '".concat(mergerKey, "', threadId '").concat(threadId, "'"));

      if (!this.isConnected) {
        throw new _exception.default("Could merge anything, the connection is down.", 'user');
      }

      if (typeof mergerKey !== 'string' || mergerKey.length === 0) {
        throw new _exception.default("Could not merge. You should privide a mergerKey.", 'user');
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
          throw new Error("Unable to merge, received a status other then \"ok\". ".concat(result.payload.message));
        }
      }).catch(function (err) {
        (0, _debug.default)('Error while trying to merge', err);

        _this4.emit(LiveClient.ERROR, new _exception.default(err, 'connection'));
      });
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

  }, {
    key: "history",
    value: function history(threadId) {
      var _this5 = this;

      if (!threadId && !_unique.default.exists({
        clientId: this._clientId,
        key: 'threadId',
        engine: this._storage
      })) {
        return this.emit(LiveClient.NO_HISTORY);
      }

      this.threadId = threadId;
      this.emit(LiveClient.REQUESTING_HISTORY);

      this._rest.get({
        path: 'thread.history',
        headers: {
          'x-flowai-clientid': this._clientId,
          'x-flowai-threadid': this.threadId
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new Error("Unable to fetch historic messages, received a status other then \"ok\". ".concat(result.payload.message));
        }

        _this5.emit(LiveClient.RECEIVED_HISTORY, result.payload);
      }).catch(function (err) {
        (0, _debug.default)('Error while trying to fetch the history', err);

        _this5.emit(LiveClient.ERROR, new _exception.default(new Error('Error while trying to fetch the history'), 'history'));
      });
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

  }, {
    key: "noticed",
    value: function noticed(threadId, instantly) {
      var _this6 = this;

      if (!threadId && !_unique.default.exists({
        clientId: this._clientId,
        key: 'threadId',
        engine: this._storage
      })) {
        // Skip
        throw new _exception.default("Could not send noticed. No threadId", 'user');
      }

      if (this._noticedTimeout) {
        // Skip this call (already one running)
        return;
      }

      this._noticedTimeout = setTimeout(function () {
        _this6._noticedTimeout = null;

        if (!_this6.isConnected) {
          throw new _exception.default("Could not send noticed message. The socket connection is disconnected.", 'user');
        }

        var enveloppe = JSON.stringify({
          type: 'thread.noticed',
          payload: {
            threadId: _this6.threadId
          }
        });
        (0, _debug.default)("Creating notice enveloppe", enveloppe);

        try {
          _this6._socket.send(enveloppe);
        } catch (err) {
          _this6.emit(LiveClient.ERROR, new _exception.default(err));
        }
      }, instantly ? 1 : 5000);
    }
    /**
     * Did we miss any messages?
     * @param {string} threadId - Optional. Specify the thread to check unnoticed messags for
     **/

  }, {
    key: "checkUnnoticed",
    value: function checkUnnoticed(threadId) {
      var _this7 = this;

      if (!threadId && !_unique.default.exists({
        clientId: this._clientId,
        key: 'threadId',
        engine: this._storage
      })) {
        return this.emit(LiveClient.CHECKED_UNNOTICED_MESSAGES, {
          unnoticed: false
        });
      }

      this.threadId = threadId;

      this._rest.get({
        path: 'thread.unnoticed',
        headers: {
          'x-flowai-clientid': this._clientId,
          'x-flowai-threadid': this.threadId
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new Error("Unable to check unnoticed messages, received a status other then \"ok\". ".concat(result.payload.message));
        }

        _this7.emit(LiveClient.CHECKED_UNNOTICED_MESSAGES, result.payload);
      }).catch(function (err) {
        (0, _debug.default)('Error while trying to find out unnoticed messages', err);

        _this7.emit(LiveClient.ERROR, new _exception.default(new Error('Error while trying to find out unnoticed messages'), 'unnoticed'));
      });
    }
    /**
     * Setup the client
     * @private
     **/

  }, {
    key: "_init",
    value: function _init() {
      this._session = null;
      this._thread = null;
      this._secret = null;
      this._socket = null;
      this._keepAliveInterval = null;
      this._reconnectTimeout = null;
      this._noticedTimeout = null;
      this._backoff = new _backo.default({
        min: 100,
        max: 20000
      });
    }
    /**
     * Try to reconnect
     * @private
     **/

  }, {
    key: "_reconnect",
    value: function _reconnect() {
      var _this8 = this;

      if (!this._isAutoReconnect) {
        (0, _debug.default)('Auto reconnect is disabled');
        return;
      }

      var timeout = this._backoff.duration() + 1000;
      (0, _debug.default)("Reconnecting with timeout in '".concat(timeout, "'ms"));
      this._reconnectTimeout = setTimeout(function () {
        _this8.emit(LiveClient.RECONNECTING);

        _this8._openConnection();
      }, timeout);
    }
    /**
     * Try to open a connection
     * @private
     **/

  }, {
    key: "_openConnection",
    value: function _openConnection() {
      var _this9 = this;

      this._isAutoReconnect = true; // Request endpoint to give a WS url

      this._rest.get({
        path: 'socket.info',
        headers: {
          'x-flowai-clientid': this._clientId,
          'x-flowai-sessionid': this.sessionId,
          'x-flowai-threadid': this.threadId
        }
      }).then(function (result) {
        if (result.status !== 'ok') {
          throw new _exception.default("Unable to get a socket URL\": ".concat(result.payload.message), 'connection');
        }

        if (typeof result.secret === 'string') {
          _this9.secret = result.secret;
        }

        _this9._handleConnection(result.payload);
      }).catch(function (err) {
        if (_this9._silent !== true) {
          console.error('LiveClient: Error while trying to connect', err);
        }

        if (!err.isFinal) {
          _this9._reconnect();
        }

        _this9.emit(LiveClient.ERROR, new _exception.default(err, 'connection'));
      });
    }
    /**
     * Handle a received endpoint
     * @private
     **/

  }, {
    key: "_handleConnection",
    value: function _handleConnection(payload) {
      var _this10 = this;

      if (!payload) {
        throw new Error("Did not receive a valid response from the backend service");
      }

      var endpoint = payload.endpoint;
      (0, _debug.default)("Opening the connection with endpoint '".concat(endpoint, "'"));
      var socket = new _websocket.w3cwebsocket(endpoint, null, this._origin);

      socket.onopen = function () {
        (0, _debug.default)('Socket onopen');

        _this10.emit(LiveClient.CONNECTED); // Clear any running interval


        clearInterval(_this10._keepAliveInterval); // Create a new Interval

        _this10._keepAliveInterval = _this10._keepAlive();
      };

      socket.onerror = function (evt) {
        var msg = "Failed socket operation.";

        switch (socket.readyState) {
          case 0:
            {
              _this10.emit(LiveClient.ERROR, new _exception.default("".concat(msg, " Socket is busy connecting."), 'connection'));

              break;
            }

          case 1:
            {
              _this10.emit(LiveClient.ERROR, new _exception.default("".concat(msg, " Socket is connected."), 'connection'));

              break;
            }

          case 2:
            {
              _this10.emit(LiveClient.ERROR, new _exception.default("".concat(msg, " Connection is busy closing."), 'connection'));

              break;
            }

          case 3:
            {
              _this10.emit(LiveClient.ERROR, new _exception.default("".concat(msg, " Connection is closed."), 'connection'));

              break;
            }

          default:
            {
              _this10.emit(LiveClient.ERROR, new _exception.default(msg, 'connection'));

              break;
            }
        }
      };

      socket.onclose = function (evt) {
        (0, _debug.default)('Socket onclose', evt);
        _this10._socket = null;

        if (evt && evt.code === 1006) {
          _this10.emit(LiveClient.ERROR, new _exception.default('The connection closed abnormally', 'connection', null, true));

          _this10.emit(LiveClient.DISCONNECTED); // DIRTY FIX? Need to check this in the future


          _this10._reconnect();
        } else if (evt && evt.reason !== 'connection failed') {
          _this10.emit(LiveClient.DISCONNECTED);

          _this10._reconnect();
        } else {
          _this10.emit(LiveClient.DISCONNECTED);
        }
      };

      socket.onmessage = function (evt) {
        (0, _debug.default)('Socket onmessage');

        if (typeof evt.data !== 'string' || evt.data.length == 0) {
          _this10.emit(LiveClient.ERROR, new _exception.default('Failed to receive a valid websocet URL, please check the clientId', 'connection'));

          return;
        }

        var _JSON$parse = JSON.parse(evt.data),
            type = _JSON$parse.type,
            payload = _JSON$parse.payload,
            message = _JSON$parse.message;

        (0, _debug.default)('Message received with type and payload', type, payload, message);

        switch (type) {
          case 'pong':
            // Ignore pongs
            break;

          case 'agent.typing':
            _this10._handleReceivedAgentTyping(payload);

            break;

          case 'message.received':
          case 'activities.created':
            _this10._handleReceived(payload);

            break;

          case 'error':
            _this10.emit(LiveClient.ERROR, new _exception.default(message, 'connection'));

            break;

          case 'message.delivered':
          case 'activities.delivered':
            _this10._handleDelivered(payload);

            break;

          default:
            {
              (0, _debug.default)('Unknow message received with type and payload', type, payload);

              _this10.emit(LiveClient.ERROR, new _exception.default("Unknown message received ".concat(evt.data), 'connection'));
            }
        }
      };

      this._socket = socket;
    }
    /**
     * Handle a received message
     * @private
     * @param {object} payload
     **/

  }, {
    key: "_handleReceived",
    value: function _handleReceived(payload) {
      (0, _debug.default)('Handling reply payload', payload);
      this.emit(LiveClient.REPLY_RECEIVED, new _reply.default(payload));
    }
  }, {
    key: "_handleReceivedAgentTyping",
    value: function _handleReceivedAgentTyping(payload) {
      (0, _debug.default)('Handling agent typing payload', payload);
      this.emit(LiveClient.AGENT_TYPING_RECEIVED, payload);
    }
    /**
     * Handle a received delivery confirmation
     * @private
     * @param {object} payload
     **/

  }, {
    key: "_handleDelivered",
    value: function _handleDelivered(payload) {
      (0, _debug.default)('Handling delivered payload', payload);
      this.emit(LiveClient.MESSAGE_DELIVERED, _message.default.build(payload));
    }
    /**
     * Disconnnect
     * @private
     **/

  }, {
    key: "_closeConnection",
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
        (0, _debug.default)('Closing the socket');

        this._socket.close();
      } else {
        (0, _debug.default)('No socket connection to close');
      }
    }
    /**
     * Send pings to keep the connection alive
     * @private
     **/

  }, {
    key: "_keepAlive",
    value: function _keepAlive() {
      var _this11 = this;

      return setInterval(function () {
        try {
          if (_this11.isConnected) {
            (0, _debug.default)('Sending keep alive packet');

            _this11._socket.send(JSON.stringify({
              type: 'ping'
            }));
          }
        } catch (err) {
          if (_this11._silent !== true) {
            console.error('Error while sending a keepalive ping', err);
          }
        }
      }, 1000 * 25);
    }
  }, {
    key: "sessionId",
    get: function get() {
      var sessionId = this._session ? this._session.id() : null;
      (0, _debug.default)("sessionId is '".concat(sessionId, "'"));
      return sessionId;
    }
    /**
     * Session Id of the connection
     * @param {?string} value - Change the session ID
     **/
    ,
    set: function set(value) {
      (0, _debug.default)("Creating a new sessionId with value '".concat(value, "'"));
      this._session = new _unique.default({
        clientId: this._clientId,
        key: 'sessionId',
        value: value,
        engine: this._storage
      });
    }
    /**
     * Default Thread Id to be used for any messages being send
     * @returns {?string} Null if no connection is active
     **/

  }, {
    key: "threadId",
    get: function get() {
      var threadId = this._thread ? this._thread.id() : null;
      (0, _debug.default)("threadId is '".concat(threadId, "'"));
      return threadId;
    }
    /**
     * Session Id of the connection
     * @param {?string} value - Change the thread ID
     **/
    ,
    set: function set(value) {
      (0, _debug.default)("Creating a new threadId with value '".concat(value, "'")); // Create a new Thread

      this._thread = new _unique.default({
        clientId: this._clientId,
        key: 'threadId',
        value: value,
        engine: this._storage
      });
    }
    /**
     * Secret
     * @returns {?string}
     **/

  }, {
    key: "secret",
    get: function get() {
      (0, _debug.default)("secret is '".concat(this._secret, "'"));
      return this._secret;
    }
    /**
     * Secret
     * @param {?string} value - Change the Secret
     **/
    ,
    set: function set(value) {
      (0, _debug.default)("Setting a new secret with value '".concat(value, "'"));
      this._secret = value;
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

  }, {
    key: "isConnected",
    get: function get() {
      var isConnected = this._socket !== null;
      (0, _debug.default)("isConnected is '".concat(isConnected, "'"));
      return isConnected;
    }
  }]);

  return LiveClient;
}(_events.default);
/**
 * @constant
 * @type {string}
 * @desc Event that triggers when an error is received from the flow.ai platform
 **/


LiveClient.ERROR = 'ERROR';
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
 * @desc Event that triggers when start busy typing received from the platform
 **/

LiveClient.AGENT_TYPING_RECEIVED = 'agent.typing';
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
var _default = LiveClient;
exports.default = _default;