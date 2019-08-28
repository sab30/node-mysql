/**
 * UtilsService.js
 * 
 * Helpful utility functions to be used across the codebase
 */

module.exports = {

    /**
     * Generate OTP to send to User for verifying their phone
     * 
     * @author Sandeep Rao <sabarish3012@gmail.com>
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
    },

    pagination: function(limit, paginationLimit) {
        let limitObj=null;
        if(limit== 0){
            limitObj = { start : 0 , end : paginationLimit}
        }
        else{
            limitObj=  { start : limit * paginationLimit , paginationLimit}
        }
        return limitObj;
    },

    getNextUniqueId(unique){
        let max = '100000';
        if(unique < 10 ){
            return max.slice(0, -1) + unique.toString();
        }
        else if(unique > 10 && unique <= 99){
            return max.slice(0, -2) + unique.toString();
        }
        else if(unique > 99 && unique <= 999){
            return max.slice(0, -3) + unique.toString();
        }
        else if(unique > 999 && unique <= 9999){
            return max.slice(0, -4) + unique.toString();
        }
        else if(unique > 9999 && unique <= 99999){
            return max.slice(0, -5) + unique.toString();
        }
        else if(unique > 99999 && unique <= 999999){
            return max.slice(0, -6) + unique.toString();
        }
        else if(unique > 999999 && unique <= 9999999){
            return max.slice(0, -7) + unique.toString();
        }
    }
};