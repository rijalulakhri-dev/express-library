const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const {body, validationResult, check} = require('express-validator')
const methodOverride = require('method-override')


// connection
require('./utils/db')

// Model
const Peminjam = require('./models/peminjam')

const app = express()
const port = 3000

const { findOne } = require('./models/peminjam')
// setup method override
// set ejs
app.set('view engine', 'ejs')
// setup partials views 
app.set('views', 'views')
// use middleware
app.use(methodOverride('_method'))

// middleware untuk basePath
app.use((req, res, next) => {
  res.locals.basePath = '/'
  next()
});

app.use(express.static('public'))
app.use(express.urlencoded({ extended:true }))


// konfigurasi flash
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

app.use(flash())

// Home
app.get('/', (req, res) => {
    res.render('index', {
        page: 'pages/home',
        title: 'Home'
    })  
})

// const peminjam = await Peminjam.find();

// Peminjam
app.get('/peminjam', async (req, res) => {

  const peminjam1 = await Peminjam.find()
  
  res.render('index', {
        page: 'pages/peminjam',
        title: 'Daftar Peminjam',
        peminjam1,
        msg: req.flash('msg')
    });
});

// app.route('/peminjam/add')
//   .get((req,res) => {
//     res.render('index', {
//       page: 'pages/add-peminjam',
//       title: 'Tambah Data'
//     })
//   })
//   .post([
//     body('nama').custom( async (value) => {
//     const duplikat = await Peminjam.findOne({ nama: value })
//     if(duplikat) {
//       throw new Error('Nama peminjam sudah terdaftar');
//     }
//     return true
//     }),
//     check('email', 'Email tidak valid!').isEmail(),
//     check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')
  
//   ],(req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       res.render('add-peminjam', {
//         title: 'Form tambah data',
//         page: 'pages/add-peminjam',
//         errors: errors.array(),

//       })
//     } else {
//       Peminjam.insertMany(req.body, (error, result) => {
//         // flash message
//         req.flash('msg', 'Data peminjam berhasil ditambahkan!')
//         res.redirect('/peminjam')
//       })
//     }
//   })
    


  // proses delete kontak  
  app.delete('/peminjam', (req, res) => {
    Peminjam.deleteOne({ nama: req.body.nama }).then((result) => {
      req.flash('msg', 'Data peminjam berhasil dihapus!')
      res.redirect('/peminjam')
    })
  })


 // form tambah data 
 app.get('/peminjam/add', (req, res) => {
    res.render('index', {
        page: 'pages/add-peminjam',
        title: 'Tambah Data'
    })
  })

  // proses tambah data
  app.post('/peminjam',[
    body('nama').custom( async (value) => {
    const duplikat = await Peminjam.findOne({ nama: value })
    if(duplikat) {
      throw new Error('Nama peminjam sudah terdaftar');
    }
    return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')
  
  ],  
  (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.render('index', {
          title: 'Form tambah data',
          page: 'pages/add-peminjam',
          errors: errors.array(),
  
        })
      } else {
        Peminjam.insertMany(req.body, (error, result) => {
          // flash message
          req.flash('msg', 'Data peminjam berhasil ditambahkan!')
          res.redirect('/peminjam')
        })
      }
    })

app.delete('/peminjam', (req, res) => {
    Peminjam.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'Data peminjam berhasil dihapus!')
        res.redirect('/peminjam')
      })
    })

    // form ubah data 
app.get('/peminjam/edit/:nama', async (req, res) => {
    const peminjam = await Peminjam.findOne({ nama: req.params.nama })
      res.render('index', {
        title: 'Form ubah data',
        page: 'pages/edit-peminjam',
        peminjam
    
      })

    })

    // proses ubah data 
    app.put(
      '/peminjam',
      [
        body('nama').custom( async (value, { req }) => {
          const duplikat = await Peminjam.findOne({ nama: value})
          
      if(value !== req.body.oldNama && duplikat) {
        throw new Error('Nama peminjam sudah terdaftar');
      }
      return true
      }),
      check('email', 'Email tidak tersedia!').isEmail(),
      check('nohp', 'No hp tidak valid!').isMobilePhone('id-ID')
    
    ],  (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
    
          res.render('index', {
            title: 'Form ubah data',
            page: 'pages/edit-peminjam',
            errors: errors.array(),
            peminjam: req.body
    
          })
        } else {
          Peminjam.updateOne(
            { _id: req.body._id },
            {
              $set: {
                  nama: req.body.nama,
                  email: req.body.email,
                  nohp: req.body.nohp,
                  alamat: req.body.alamat,
              }
            }
            ).then((result) => {
              // flash message
              req.flash('msg', 'Data Peminjam berhasil diubah!')
              res.redirect('/peminjam')
    
            })
        }
    })


    // detail peminjam 
app.get('/peminjam/:nama', async (req, res) => {

  const peminjam = await Peminjam.findOne({ nama: req.params.nama })

      res.render('index', {
        page: 'pages/detail',
        title: 'Detail peminjam',
        peminjam,
      })
    })


    // Buku 
app.get('/buku', (req, res) => {
  res.render('index', {
      page: 'pages/buku',
      title: 'Daftar Buku'
  })  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))