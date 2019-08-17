/**
 * LoggingService.js
 * 
 * 
 */

module.exports = {

    /**
     * Sends a structured log to GCP Stackdriver Logging. You can 
     * view logs in the "Global" resource type.
     * 
     * @param {string} message The log identifier like 'request-log' etc.
     * @param {string} referenceId The request reference identifier
     * @param {object} data The contents of the log itself
     * @author Nagarjun Palavalli <nag@tripcloud.io>
     */
    send: function(message, referenceId, data) {

        // Log in console only if running on local machine
        sails.log(message, referenceId, data);
    }
};