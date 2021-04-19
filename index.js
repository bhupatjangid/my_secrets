const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose=require("mongoose")

const app=express()

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://bhupat2000:mgs38BZPD57ZFjqG@cluster0.e1bpn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})




const itemSchema = mongoose.Schema({
    name:String
})

const Item = mongoose.model("Item",itemSchema)

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    list:[itemSchema]
})

const User = mongoose.model("User",userSchema)

const item1 = new Item({
    name:"This is my Secrets"
})
myArray=[item1]

app.get('/',function(req,res){
    res.render("home")
})

app.get('/login',function(req,res){
    res.render("login")
})

app.get('/register',function(req,res){
    res.render("register")
})

app.get('/logout',function(req,res){
    res.redirect('/')
})

app.get('/secrets/:newId',function(req,res){
    const myId = req.params.newId
    
    User.findOne({_id:myId},function(err,result){
        
        res.render('secrets',{listItem:result.list,title:myId})
    })
})

app.post('/register',function(req,res){
    const item = new User({
        email:req.body.username,
        password:req.body.password,
        list:myArray
    })
    
    item.save()
    res.redirect('/secrets/'+item._id)
})



app.post('/login',function(req,res){
    const email=req.body.username;
    const password=req.body.password;
    
    User.findOne({email:email},function(err,result){
        
        if(err){
            console.log(err);
        }else{
            if(result.password === password){
                res.redirect('/secrets/'+result._id)
            }
            else{
                res.redirect('/login')
            }
        }
    })

})


app.post('/addItem',function(req,res){
    const myData = req.body.newData;
    const myNewId = req.body.itsId;
    
    const myPData = new Item({
        name:myData
    }) 
    User.findOne({_id:myNewId},function(req,result){
        if(myPData.name != ""){
            result.list.push(myPData);
            result.save()
        }
        
        res.redirect('/secrets/'+myNewId)
    })

})


app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
   

    User.findOneAndUpdate({_id: listName}, {$pull: {list: {_id: checkedItemId}}}, function(err, foundList){
    if (!err){
        res.redirect('/secrets/'+listName)
    }
    });
    
  
  
  });


app.listen(process.env.PORT || 4500,function(){
    console.log("server running on port 4500");
})


