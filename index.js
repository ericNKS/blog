const express = require("express");
const sequelize = require("sequelize");
const session = require('express-session');
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require('./users/User');
const app = express();

// Session
app.use(session({
    secret: "Eu amo minha fernanda",
    cookie: {
        maxAge: 600000
    }
}))

//rotas

const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController');
const UserController = require('./users/UsersController');

//view engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Database

connection
    .authenticate()
    .then(()=>{
        console.log("Conexao fetia com sucesso");
    })
    .catch((e)=>{
        console.log(e);
    });

    // use controllers
    app.use('/', CategoriesController);
    app.use('/', ArticlesController);
    app.use('/', UserController);

    app.get("/",(req,res)=>{
        Article.findAll({
            order: [
                ['id', 'DESC']
            ],
            limit: 4
        }).then(articles=>{
            Category.findAll().then((categories)=>{
                res.render('index', {articles, categories});
            })
        })
    });
    app.get("/:slug",(req,res)=>{
        let slug = req.params.slug;

        Article.findOne({
            include: [{model: Category}],
            where: {slug: slug}
        }).then(article=>{
            if (article != undefined) {
                res.render('article', {article});
            } else {
                res.redirect('/');
            }
        })
        .catch((e)=>{
            res.redirect('/');
        })
    });

    app.get("/category/:slug",(req,res)=>{
        let slug = req.params.slug;

        Category.findOne({
            include: [{model: Article}],
            where: {slug: slug}
        }).then(category=>{
            if (category != undefined) {
                res.render('category', {category, articles: category.articles});
            } else {
                res.redirect('/');
            }
        })
        .catch((e)=>{
            res.redirect('/');
        })
    });

app.listen(8080, ()=>{
    console.log("o servidor esta rodando");
})