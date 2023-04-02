const mongoose = require('mongoose');
const Peminjam = mongoose.model('Peminjam', {
    nama : {
        type: String,
        required: true,
    },
    nohp: {
        type: String,
        required: true,
    },
    email : {
        type: String,
    },
    alamat : {
        type: String,
    },
})

module.exports = Peminjam