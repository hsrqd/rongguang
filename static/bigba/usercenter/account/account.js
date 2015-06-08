define('bigba:page/usercenter/account/account.js', function(require, exports, module){ var verifyphone = require("bigba:widget/common/verifyphone/verifyphone.js"),
    account = require('bigba:widget/usercenter/account/account.js');

$(account).bind('account.verifyphone', function(e, item) {
    verifyphone.bindPhone();
});

module.exports = {
    init: function() {
        account.init();
    }
} 
});