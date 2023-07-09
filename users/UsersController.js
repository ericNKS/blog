const express = require("express");
const router = express.Router();
const User = require('./User');
const bcrypy = require("bcryptjs");
const middleware = require('../middleware/AuthMiddleware');


router.get('/user/login',(req,res)=>{
    res.render('admin/users/login')
});
router.post('/user/login',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        email: email
    }).then((user) => {
        if (user != undefined) {
            // Validar senha
            let correct = bcrypy.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                        id: user.id,
                        email: user.email
                }
                res.redirect('/admin/articles');
            } else {
                res.redirect('/user/login');
            }
            
        } else {
            res.redirect('/user/login');
        }
    }).catch((err) => {
        res.json(err)
    });

});
router.get('/user/create',(req,res)=>{
    res.render('admin/users/register');
});

router.post('/user/store',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        where:{
            email: email
        }
    }).then((user) => {
            if (user == undefined) {
                let salt = bcrypy.genSaltSync(10);
                let hash = bcrypy.hashSync(password, salt);
                User.create({
                    email:email,
                    password: hash
                }).then((user)=>{
                    res.redirect('/')
                });
            } else {
                res.redirect('/user/create');
            }
    }).catch((err) => {
       console.log(err); 
    });
});

router.get('/user/logout', middleware, (req,res)=>{
    req.session.destroy((err)=>{
        res.redirect('/');
    });
});


module.exports = router