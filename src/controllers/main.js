const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const {Op} = require('sequelize')

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    const {id} = req.params
    db.Book.findByPk(id,{
      include : ['authors']
    })
    .then((book) => {
      
      return res.render('bookDetail',{book})
    })
    
  },
  bookSearch: (req, res) => {
    
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    db.Book.findAll({
      where : {
        title : {
          [Op.substring] : req.body.title
        }
      }
    })
    .then((books) => {
      
      return res.render('search',{
        books,
        
        
      })
    })
    
  },
  deleteBook: (req, res) => {
    // Implement delete book
    db.Book.destroy({
      where : {
        id : req.params.id
      }
    })
    .then(() => {
      return res.redirect('/')
    })
    .catch((error) => console.log(error));
    
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    db.Author.findByPk(req.params.id,{
      include : ['books']
    })
    .then((author)=>{
      
    
       return res.render('authorBooks',{author})
    }).catch((error)=> console.log(error))
    
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    db.User.findOne({
      where : {
        email : req.body.email.trim()
      }
    })
    .then((user)=> {
      if(!user ||  !bcryptjs.compareSync(req.body.password, user.Pass) ){
        res.render('home', {error : 'Credenciales invalidas'})
      }else{
        req.session.userLogin = {
          name : user.Name,
          rol : user.CategoryId
        }
        res.locals.userLogin = req.session.userLogin
        if(req.body.recordame){
          res.cookie("userBook", req.session.userLogin,{
            maxAge: 1000* 60,
          });
        }
        return res.redirect('/')
      }
    })
    
  },
  edit: (req, res) => {
    db.Book.findByPk(req.params.id)
    .then((books) => {
      return res.render('editBook', {
        books
      })
    })
    
  },
  processEdit: (req, res) => {
    // Implement edit book
    const{title, cover, description} = req.body
    db.Book.update(
      {
        title: title.trim(),
        cover : cover.trim(),
        description : description.trim()
      },
      {
        where : {
          id : req.params.id
        }
      }
    )
    .then(() =>{
      return res.redirect('/')
    })
   
  },
  logout : (req, res) => {
    req.session.destroy()
     return res.redirect('/')
  }
};

  

module.exports = mainController;
