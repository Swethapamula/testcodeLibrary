const express = require('express');
const app =new express();
var session = require('express-session');


const nav= [
           {link:'/adminhome',name:'home'},
           {link:'/books',name:'Books'},
           {link:'/authors',name:'Authors'},
           {link:'/',name:'Logout'}];
const nav2=
[
  {link:'/home',name:'home'},
  {link:'/viewbooks',name:'Books'},
  {link:'/viewauthors',name:'Authors'},
  {link:'/',name:'Logout'}];


const booksRouter= require("./src/routes/bookroutes")(nav);
const authorRouter= require("./src/routes/authorroutes")(nav);
const homeRouter=require("./src/routes/homeroutes")(nav2);
const homeadminrouter=require("./src/routes/homeadminrouter")(nav);
const SignupRouter=require("./src/routes/SignupRouter")(nav);
const adminrouter= require("./src/routes/adminrouter")(nav);
const viewbookrouter=require("./src/routes/viewbookrouter")(nav2);
const viewauthorroute=require("./src/routes/viewauthorroute")(nav2)
const port= process.env.PORT || 50000;
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.set ("view engine","ejs");
app.set("views", "./src/views");

app.use("/adminhome",homeadminrouter);

const Signupdata=require("./src/model/Signupdata");



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


app.get("/", function(req,res){
  res.render("login")
});


app.post("/POST", function(req,res){
  var Item={
    username:req.body.username,
    password:req.body.password
  }
  console.log(Item);
  if (Item.username=='admin' && Item.password=='12345')
  {
    req.session.role='admin';

    res.redirect("/adminhome");
  }
  else if (Item.username=='swetha' && Item.password=='12345')
 {
  req.session.role='user';
  res.redirect("/adminhome");

}
else{
  console.log("User not found");
  res.redirect("/")
}
 
 /* Signupdata.findOne({username:Item.username,password:Item.password},(err,user)=>{
  if(err)
  {
      console.log(err);
   }
  else  if (user!==null)
   {
    req.session.role = 'user';

   res.redirect("/home")
   }
    else if(Item.username=="admin" && Item.password=='12345')
    {            
       req.session.role = 'admin';

      res.redirect("/adminhome")
    }
   else
   {
     res.redirect('/')
     console.log("Invalid credentials")
  
   }

  })*/

});


  
  var authenticate = function (req, res, next) {  //admin or user
    console.log(req.username);

    if (req.session.role == 'admin' || req.session.role == 'user') {
        next();
    }
     else {
      res.redirect('/');
   }
  }
  
  app.use(authenticate);
  
  app.use('/books',booksRouter);
  app.use('/authors',authorRouter);
  app.use('/home',homeRouter);
  app.use("/admin",adminrouter);
  app.use("/signup",SignupRouter);
  app.use("/viewbooks",viewbookrouter);
  app.use("/viewauthors",viewauthorroute);
  
 

 app.listen(port,()=>{console.log("Server ready at port" +port)});