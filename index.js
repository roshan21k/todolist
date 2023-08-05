import express from 'express';
import mongoose from 'mongoose';

const uri = "mongodb+srv://todolist:test123@cluster0.bms1tjx.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri)

const itemSchema = {
    name : String
};

const Item = mongoose.model("item",itemSchema);


const app = express();
const port = 3000;

let currentYear = new Date().getFullYear();
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
app.get("/",async (req,res)=>{
    let notes =  await Item.find({});
    res.render("index.ejs",{
        note : notes,
        year : currentYear
    });

});
app.post("/add",(req,res)=>{
    const itemName = req.body["note"]
    const item = new Item({
        name: itemName,
    });
    item.save();
    res.redirect("/")
})


app.post("/delete",async (req,res)=>{
    const id = req.body["delete"]
    await Item.findByIdAndDelete(id);
    res.redirect("/")
})

app.get("/view/:id/:number",async (req,res)=>{
    const id = req.params.id;
    const num = req.params.number;
    res.render("view.ejs",{
        content : await Item.find({_id:id},{_id:0,name:1}),
        no:num,
        year : currentYear
    })
});
app.listen(port,()=>{
    console.log(`Running on port ${port}`)
});