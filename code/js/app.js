const express = require('express');
const app = express()
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path')
//const popup = require('popups');
const router = express.Router();
const { pool } = require("./dbConfig.js");
const bodyParser = require('body-parser');  
const { password, rows } = require('pg/lib/defaults');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'))

app.use(session({
  secret:'geeksforgeeks',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

let acc_no = 30;
let pass = null;
var emailid;
var rec_balance,send_balance;

app.get('/',function(req,res){
    res.sendFile('C:/Users/HARSH MEHTA/Downloads/ACB_files/home.html');
  });


  app.post('/signup', function (req, res) {
    let fname  = req.body.fname;
    let mname = req.body.mname;
    let lname = req.body.lname;
    let dob = req.body.dob;
    let gender = req.body.gender;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let country = req.body.country;
    let accounttype = req.body.accounttype;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;

    console.log(fname, mname, lname, dob, gender,address, city, state, country, accounttype, email, password, password2);

    pool.query(
        `INSERT INTO banking_system.customer_details(
          firstname, middlename, lastname, dateofbirth, gender, address, city, state, country, account_type, email_id, password, confirm_password, account_number,balance)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15);`,
        [fname, mname, lname, dob, gender,address, city, state, country, accounttype, email, password, password2,acc_no,1000]
      
    ); 
    
    acc_no++;

    res.sendFile('C:/Users/HARSH MEHTA/Downloads/ACB_files/home.html');
    
  })

  app.post('/login', function (req, res) {
    
    emailid  = req.body.emailid;
    let psw = req.body.psw;

    var sql = "select password from banking_system.customer_details where email_id = $1";
    pool.query(`select password from banking_system.customer_details where email_id = $1`,
    [emailid], function(err, results){

      if (err) throw err;

      var row=results.rows;
      var org_psw=row[0].password;
      
      if (org_psw == psw)
        res.sendFile('C:/Users/HARSH MEHTA/Downloads/ACB_files/dashboard.html');
      else
      {
        res.sendFile('C:/Users/HARSH MEHTA/Downloads/ACB_files/home.html');
      }

    })

  })

  app.post('/transfer', function (req, res) {
    
    let rec_account  = req.body.account_num_rec;
    let amount = req.body.amount;

    //console.log(rec_account,amount);

    pool.query(`select balance from banking_system.customer_details where account_number = $1`,
    [rec_account], function(err, results){

      if (err) throw err;

      var row=results.rows;
      var rec_balance=Number(row[0].balance);

      console.log(rec_balance)
    

    pool.query(`select balance from banking_system.customer_details where email_id = $1`,
    [emailid], function(err, results){

      if (err) throw err;

      var row=results.rows;
      var send_balance=row[0].balance;

      console.log(send_balance);

      pool.query(`update banking_system.customer_details set balance=$1 where email_id = $2`,
    [Number(send_balance)-Number(amount),emailid], function(err){})
    
    pool.query(`update banking_system.customer_details set balance=$1 where account_number = $2`,
    [Number(rec_balance)+Number(amount),rec_account], function(err){})

    })

  })

    res.sendFile('C:/Users/HARSH MEHTA/Downloads/ACB_files/dashboard.html');

  })

 app.listen(5500, "127.0.0.1", () => {
    console.log("Listening on port 5500");
  });

console.log('Running at Port 5500');