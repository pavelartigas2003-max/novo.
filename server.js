const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static("uploads"));

// DATABASE (простая)
let posts = [];
let messages = [];

// ⚡ Получить список объявлений
app.get("/api/posts", (req,res)=>{
  const { cat, q } = req.query;
  let arr = posts;

  if(cat) arr = arr.filter(p=>p.cat===cat);
  if(q) arr = arr.filter(p=>p.title.toLowerCase().includes(q.toLowerCase()));

  res.json(arr);
});

// ⚡ Добавить объявление
app.post("/api/posts", upload.single("img"), (req,res)=>{
  const p = {
    id: uuid(),
    title: req.body.title,
    price: req.body.price,
    desc: req.body.desc,
    cat: req.body.cat,
    user: req.body.user,
    img: "/uploads/" + req.file.filename
  };
  posts.push(p);
  res.json(p);
});

// ⚡ Получить одно объявление
app.get("/api/post/:id", (req,res)=>{
  res.json(posts.find(p=>p.id===req.params.id));
});

// ⚡ Получить чат
app.get("/api/chat", (req,res)=>{
  const { post, user } = req.query;
  res.json(messages.filter(m => m.post === post));
});

// ⚡ Отправить сообщение
app.post("/api/chat", (req,res)=>{
  const m = {
    id: uuid(),
    user: req.body.user,
    post: req.body.post,
    text: req.body.text,
    time: Date.now()
  };
  messages.push(m);
  res.json(m);
});

app.listen(3000, ()=>console.log("API RUNNING 3000"));
