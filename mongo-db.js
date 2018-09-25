module.exports = function(){
    var mongoose = require('mongoose');
    var mongo = mongoose.connect('mongodb://localhost/address_book',{ useNewUrlParser: true });
    return mongo;
}
