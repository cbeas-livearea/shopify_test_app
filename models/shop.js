var mongoose = require('mongoose');

var shopSchema = mongoose.Schema({
shop: { type: String,index: true,unique : true, required : true},
scopes: String,
accessToken: String
});


var Shop = mongoose.model('Shop', shopSchema);


module.exports = Shop;