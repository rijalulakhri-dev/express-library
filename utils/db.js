const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
// mongoose.set("strictQuery", true);
// useNewUrlParser: true, 
// useUnifiedTopology: true
