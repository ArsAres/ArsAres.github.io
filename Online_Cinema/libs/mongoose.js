var mongoose = require('mongoose');
var config = require('../config/index');

// mongoose.Promise = global.Promise;﻿

mongoose.connect(config.get('mongoose:uri'), {useNewUrlParser: true});

module.exports = mongoose;