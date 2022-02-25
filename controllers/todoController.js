const { Todo } = require('../models');


module.exports.listAll = async function(req, res) {
    const todos = await Todo.findAll({
        where:{
            user_id:req.user.id
        }
    });

    function addUserToViews(req,res,next){
        if(req.user){
            res.locals.user=req.user;
        }
        next();
    }
    let completeItems = todos.filter(item => item.complete);
    let incompleteItems = todos.filter(item => !item.complete);

    res.render('todos/viewAll', {
        completeItems,
        incompleteItems
    });
};


module.exports.displayAddItem = function(req, res) {
    const item = {
        name: '',
        description: '',
    }
    res.render('todos/newItem', {
        item
    })
};

module.exports.addNewItem = async function(req, res){
    await Todo.create({
        description: req.body.description,
        user_id: req.user.id
    });
    res.redirect('/');
};


module.exports.viewEditItem = async function(req, res) {
    const todo = await Todo.findOne({
        where: {
            id: req.params.id,
            user_id: req.user.id
        }
    });
    if (!todo) {//id we cant find it
        res.redirect('/');
    } else {
        res.redirect('todos/editItem', {item: todo})
    }
};


module.exports.saveEditItem = async function(req, res) {
    await Todo.update({ description: req.body.description}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


module.exports.deleteItem = async function(req, res) {
    await Todo.destroy({
        where: {
            id: req.params.id,
            user_id:req.user.id
        }
    })
    res.redirect('/');
};


module.exports.makeItemComplete = async function(req, res) {
    await Todo.update({ complete:  true}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


module.exports.markItemIncomplete = async function(req, res) {
    await Todo.update({ complete:  false}, {
        where:{
            id: req.params.id,
        }
    })
    res.redirect('/');
};


