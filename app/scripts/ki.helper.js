/**
 * Created by holger on 12.06.2014.
 */
"use strict";
ki.namespace('ki.helper');

/**
 * The helper module provides various helper functions
 */
ki.helper = (function() {
    var default_level = 'INFO';

    function _log(msg, level) {
        var loglevel = level || default_level;
        if (window.console && window.console.log) {
            window.console.log('[' + loglevel.toUpperCase() + ']' + ' ' + msg);
        }
    }

    function _dir(object) {
        if (window.console && window.console.dir) {
            window.console.dir(object);
        } else {
            _log('Unable to console.dir object' + object, 'INFO');
        }
    }

    return {
        /**
         * This method logs a message on the console
         * @param msg {String} The message
         * @param level {String} optional loglevel
         */
        log: function(msg, level) {
            _log(msg, level);
        },
        /**
         * This method logs the message on debug level
         * @param msg {String}
         */
        logDebug: function(msg) {
            _log(msg, 'DEBUG');
        },
        /**
         * This method logs the message on info level
         * @param msg {String}
         */
        logInfo: function(msg) {
            _log(msg, 'INFO');
        },
        /**
         * This method logs the message on warn level
         * @param msg {String}
         */
        logWarn: function(msg) {
            _log(msg, 'WARN');
        },
        /**
         * This method logs the message on error level
         * @param msg {String}
         */
        logError: function(msg) {
            _log(msg, 'ERROR');
        },
        /**
         * This method logs the message on fatal level
         * @param msg {String}
         */
        logFatal: function(msg) {
            _log(msg, 'FATAL');
        },
        /**
         * This method tries a console.dir with the given object
         * @param msg {String}
         */
        logDir: function(object) {
            _dir(object);
        }
    };
})();