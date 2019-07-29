/**
 * UtilsService.js
 * 
 * Helpful utility functions to be used across the codebase
 */

module.exports = {

    /**
     * Generate OTP to send to User for verifying their phone
     * 
     * @author <sabarish3012@gmail.com>
     */
    generateUniqueId: function(length) {

        var digits = '0123456789';
        var OTP = '';
        for (var i = 0; i < length; ++i) {
            var random = Math.random();
            var charIndex = Math.floor(random * ((digits.length - 1) - 0));
            OTP += digits[charIndex];

        }
        return OTP;
    },
    /**
     * Generate OTP to send to User for verifying their phone
     * 
     * @author <sabarish3012@gmail.com>
     */
    generateOTP: function(length) {

        var digits = '0123456789';
        var OTP = '';
        for (var i = 0; i < length; ++i) {
            var random = Math.random();
            var charIndex = Math.floor(random * ((digits.length - 1) - 0));
            OTP += digits[charIndex];

        }
        return OTP;
    }
};