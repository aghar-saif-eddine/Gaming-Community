var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var path = require('path');
const multer = require('multer');
const bodyParser= require('body-parser');

fs = require('fs-extra');
// connect to database 
var con = mysql.createConnection({
  database: "PC-Gamming",
  host: "localhost",
  user: "root",
  password: ""
});
con.connect(function() {
  console.log("Connected!");
});
/* GET home page. */
router.get('/', function(req, res, next) {
  con.query("SELECT * FROM `pc-gamming`.`item`", function(
    err,result,fields){
      res.render("index",{ result: result});
             }); 
      });
// router.all('/', function(req, res, next) {
//   res.send({message:"error"});
// });

router.use(bodyParser.urlencoded({extended: true}));
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {     
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));

}
})
var upload = multer({ storage: storage });
router.post('/additem', upload.single('myFile', 12), (req, res, next) => {
 var titre= req.body.title;
 var description= req.body.description;
 var myFile =req.file.filename ;
  const db =
 "INSERT INTO `pc-gamming`.`item` (title, description, myFile ) VALUES ('" +
 titre +
 "', '" +
 description +
 "', '" +
 myFile +
 "')";
con.query(db, (err, result) => {
 if (err) {
   return res.status(500).send(err);
 }
 con.end();
 res.redirect("/additem" );
}); 
});
// navigate to page from 
router.get("/forum", function(req, res, next) {
  res.render("forum", {});
});

router.get("/feedback" , function (req , res) {
  con.query("SELECT * FROM `pc-gamming`.`message`", function(
    err,result,fields){
      res.render("feedback",{ result: result});
             }); 
})
router.get("/lastnews" , function (req , res) {
  con.query("SELECT * FROM `pc-gamming`.`item`", function(
    err,result,fields){
      res.render("lastnews",{ result: result});
             }); 
})
router.get("/indexdash", function(req, res, next) {
  res.render("indexdash", {});
});
router.get("/home", function(req, res, next) {
 con.query("SELECT COUNT (*) as cnt FROM `pc-gamming`.`message` ", function(
      err,result,fields){
      let results =result[0].cnt;
       con.query("SELECT COUNT (*) as cnnt FROM `pc-gamming`.`item` ", function(
        err,result,fields){
        let resultss =result[0].cnnt;
        con.query("SELECT COUNT (*) as cnnct FROM `pc-gamming`.`tbluser` ", function(
          err,result,fields){
          let results2 =result[0].cnnct;
          res.render("home",{ resultss: resultss , results: results,results2: results2});
         }); 
        }); 
      }); 
  
});
/*login admin */
router.post("/loginadmin", function(req, res) {  
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    con.query('SELECT * FROM admin WHERE email= ? AND password = ?', [email, password], function(error, results, fields) {
          if (results.length > 0) {
             res.redirect('/home');
        } else {
            res.send('Incorrect Username and/or Password!');
        }           
        res.end();
    });
} else {
    res.send('Please enter Username and Password!');
    res.end();
}
 });

router.get("/additem", function(req, res, next) {
  con.query("SELECT * FROM `pc-gamming`.`item`", function(
    err,result,fields){
      res.render("additem",{ result: result });
             });  
});
// navigate to user
router.get("/user", function(req, res, next) {
  con.query("SELECT * FROM `pc-gamming`.`tbluser`", function(
    err,result,fields){
      res.render("user",{ result: result });
             });
});
// delete user 
router.post("/user", function(req, res, next) {
  con.query(
    "DELETE FROM  `pc-gamming`.`tbluser` WHERE `user_id`=?",
    [req.body.delete],
    function(error, results, fields) {
      if (error) throw error;
      res.render("user");
    }
  );
});

/*add post*/

router.get("/delete", function(req, res, next) {
  con.query("SELECT * FROM `pc-gamming`.`item`", function(
    err,result,fields){
      res.render("delete",{ result: result });
             });    
});
// Delete post
 router.post("/delete", function(req, res, next) {
     con.query(
     "DELETE FROM `item` WHERE `id`=?",
     [req.body.delete],
     function(error, results, fields) {
       if (error) throw error;
       res.render("delete");
     });
 });
 
 // add message
 router.post('/message', function (req ,res) {
   let name =req.body.name;
   let email = req.body.email;
   let phone =req.body.phone;
   let message =req.body.message;
    const db=
   "INSERT INTO `pc-gamming`.`message` (name, email, phone , message ) VALUES ('" +
 name +
 "', '" +
 email +
 "', '" +
 phone +
 "', '" +
 message +
 "')";
con.query(db, (err, result) => {
 if (err) {
   return res.status(500).send(err);
 }
 con.end();
 res.redirect("/" );
}); 
 });
 // navigate to feedback

 module.exports = router;
