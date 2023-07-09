const express = require('express');
const router = express.Router();
const Article = require('./Article');
const Category = require("../categories/Category");
const slugfy = require("slugify");
const middleware = require('../middleware/AuthMiddleware');


router.get('/admin/articles',middleware,(req,res)=>{
    Article.findAll({
        include: [{model: Category}]
    })
    .then((articles)=>{
        res.render('admin/articles/index', {articles});
    });
    
});


router.get('/admin/articles/new',middleware ,(req,res)=>{
    Category.findAll()
        .then(categories =>{
            res.render('admin/articles/new', {categories});
        })
});

router.post('/articles/save', middleware, (req,res)=>{
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title,
        slug: slugfy(title),
        body,
        categoryId: category

    })
    .then(()=>{
        res.redirect('/admin/articles');
    });
});

router.post('/article/delete', middleware, (req,res)=>{
    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id : id
                }
            })
            .then(()=>{
                res.redirect('/admin/articles');
            })
        }else{
            res.redirect('/admin/articles');
        }
    }else{
        res.redirect('/admin/articles');
    }
    
});

router.get('/admin/article/edit/:id', middleware, (req,res)=>{
    let id = req.params.id;
    Article.findByPk(id).then((article)=>{
        if (article != undefined) {
            Category.findAll().then((categories)=>{
                res.render('admin/articles/edit', {article, categories});
            });
        } else {
            res.redirect('/admin/articles/');
        }
    })
    .catch(e=>{
        res.redirect('/admin/articles/');
    });
    
});

router.post('/articles/update', middleware, (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let slug = slugfy(title)
    let body = req.body.body;
    let category = req.body.category;

    Article.update({
        title: title,
        slug: slug,
        body: body,
        category: category
    },{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/admin/articles/');
    })
    .catch((e)=>{
        res.redirect('/admin/articles/');
    });

});

router.get("/articles/page/:num", (req,res)=>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) -1) * 4;
    }

    Article.findAndCountAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4,
        offset: offset
    }).then(articles=>{
        var next;

        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories=>{
            res.render('admin/articles/page', {result, categories});
            //res.json(result);
        })

    })

});


module.exports = router;