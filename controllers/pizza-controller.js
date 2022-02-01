const { Pizza } = require('../models');

const pizzaController = {
    // the functions will go in here as methods

    // get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            //in MongoDB instead of joining two tables in mySQL to get data, in MongoDB we populate a field
            .populate({
                path: 'comments',
                //select tells MongoDB we do not care about the __v field on comments. The minus indicates we dont want it to be returned.
                select: '-__v'
            })
            .select('-__v')
            // Sort so the newest pizza returns first. the minus sorts in DESC order by _id value
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(eer => {
                console.log(err);
            });
    },

    // get one pizza by id
    // No sort needed because you will only be sorting by a single pizza.
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => {
            if (!dbPizzaData) {
            // if no pizza found return 404 error
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
            }
            // returns back data in dbPizzaData
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // create Pizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    //update pizza by id
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new:true })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            // Need to make sure data exists with the if statement. If it skips over this then it found an ID match.
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found wiht this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = pizzaController;