const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const mongodb = require('./db/Schema');
const url = 'mongodb://127.0.0.1:27017/bililing';
const app = express()
const cors = require('cors')
app.use(cors())
app.use(bodyparser.json())
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


//connect mongodb
// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(
        () => {
            console.log("server Connection successfully");
        },
        (error) => {
            console.log("Error :", error);
        }
    );

app.listen(8085, function check(error) {
    if (error)
        console.log(error)

    else
        console.log("port is connected")
});

//Registration  Post 
app.post('/register', (req, res) => {
    const data = new mongodb({
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword

    })

    console.log(data.password);

    bcrypt.hash(data.password, 10, (err, result) => {
        if (err) {
            console.log('Something went wrong', err);
            res.send(err)
        } else {
            console.log("hash password is :", result);
            data.password = result;
            data.save().then((data) => {
                res.send(data)
            }).catch((e) => {
                console.log('not saved :', e)
            })
        }
    })

})

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    mongodb.findOne({ email }).then((data) => {
        bcrypt.compare(password, data.password, function (err, result) {

            if (result) {
                // console.log('Login succesfully' , result);

                const token = jwt.sign({ data }, 'secretkey', { expiresIn: '1h' })

                // console.log(token);
                res.json(
                    {
                        status: 'success',
                        token: 'JWT ' + token,
                        user: {
                            id: data.id,
                            name: data.name,
                            username: data.username,
                            email: data.email
                        }
                    }
                )
            } else {
                console.log('password not matched', err);
                res.send('not matched')
            }
        })
    }).catch((e) => {
        res.send('credential not matcehd', e)
        console.log('Credetial is not availble in database');
    })
})


app.delete('/delete/:id', (req, res) => {
    mongodb.findByIdAndRemove(req.params.id).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send(e)
    })
})


app.patch('/update/:_id', (req, res) => {
    mongodb.findByIdAndUpdate(req.params._id, { $set: req.body }).then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send('cant updates due to :', e)
    })
})


app.get('/all', (req, res) => {
    mongodb.find().then((data) => {
        res.send(data)
    }).catch((e) => {
        res.send('not found all data', e)
    })
})   