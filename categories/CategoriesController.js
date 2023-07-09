const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugfy = require("slugify");

router.get('/admin/categories/new', (req,res)=>{
    res.render("admin/categories/new");
});

router.post('/categories/save', (req,res)=>{
    let title = req.body.title;

    if(title != undefined || title != ''){
        Category.create({
            title: title,
            slug: slugfy(title)
        })
        .then(() => {
            res.redirect("/admin/categories/");
        }).catch((err) => {
            res.json(err)
        });
    }else{
        res.statusCode = 400;
        res.redirect("/admin/categories/new");
    }
});

router.get('/admin/categories',(req,res)=>{

    Category.findAll()
            .then((categorias)=>{
                res.render('admin/categories/index', {categorias : categorias});
            });
    
});

router.post('/categories/delete', (req,res)=>{
    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id : id
                }
            })
            .then(()=>{
                res.redirect('/admin/categories');
            })
        }else{
            res.redirect('/admin/categories');
        }
    }else{
        res.redirect('/admin/categories');
    }
    
});

router.get('/admin/categories/edit/:id', (req,res)=>{
    let id = req.params.id;

    if(!isNaN(id)){
        Category.findByPk(id).then(category=>{
            if(category != undefined){
                res.render('admin/categories/edit', {category: category});
            }else{
                res.redirect('/admin/categories');
            }
        })
        .catch(e=>{
            res.redirect('/admin/categories');
        })
    }else{
        res.redirect('/admin/categories');
    }

});

router.post('/categories/update', (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({title: title, slug: slugfy(title)},{
        where:{
            id: id
        }
    })
    .then(category=>{
        console.log(title);
        res.redirect('/admin/categories');
    })
    .catch(e=>{
        console.log("erro");
        res.redirect('/admin/categories');
    })

});

module.exports = router;