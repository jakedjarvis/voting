var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/commentDB', {useMongoClient:true});
var candidateSchema = mongoose.Schema({
    Name:String,
    Votes:Number
});
candidateSchema.methods.incrementVote = function(cb) {
    this.Votes += 1;
    this.save(cb);
};

var candidate = mongoose.model('candidate', candidateSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function() {
    console.log("Connected to db");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', function(req,res,next) {
    console.log("In admin get");

    candidate.find(function(err,candidateList) {
        if (err) return console.error(err);
        else{
            console.log(candidateList);

            res.json(candidateList);
        }
    })
});

router.get('/voter', function(req,res,next) {
    console.log("In voter get");

    candidate.find(function(err,candidateList) {
        if (err) return console.error(err);
        else{
            console.log(candidateList);

            res.json(candidateList);
        }
    })
});

router.post('/admin', function(req, res, next) {
    console.log("In admin post");
    console.log(req.body);

    var newCandidate = new candidate(req.body);

    newCandidate.save(function(err,post) {
        if(err) return console.error(err);

        console.log(post);
        res.sendStatus(200);
    });
});

router.param('candidate', function(req, res, next, id) {
    var query = candidate.findById(id);
    query.exec(function(err, candidate){
        if (err) {return next(err);}
        if (!candidate) {return next(new Error("Can't find candidate"));}
        req.candidate = candidate;
        return next();
    });
});

router.get('/admin/:candidate', function(req, res) {
    res.json(req.json);
});

router.delete('/admin/:candidate', function(req, res) {
    console.log(req.candidate);
    candidate.find(req.candidate).remove().exec(function(err, data){
        if(err) {return console.error(err)}
        res.sendStatus(200);
    })

});

router.put('/admin/:candidate/incrementVotes', function(req, res, next) {
    req.candidate.incrementVote(function(err,candidate) {
        if(err) {return next(err);}
        res.json(candidate);
    });
});

module.exports = router;
