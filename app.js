require('dotenv').config();
const express = require('express');
const app = express()
const port = process.env.port;
const mongoDB_url = process.env.atlus_url;
const secret = process.env.sec;
const {authenticateUser} = require('./middlewares');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Post = require('./models/post.model');
const Owner = require('./models/owner.model');
const { v4: uuidv4 } = require('uuid');

app.use(express.json()); 


main().then(() => {
  console.log("connected to db")})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoDB_url);
};

//to create an owner
app.post("/owner/signup", async(req, res) => {
  try {
    let {email, password} = req.body;
    let existingEmail = await Owner.findOne({email});
  
  if(!existingEmail) {
      let hashedPassword = await bcrypt.hash(password, 10)
      let newOwner = new Owner({email, hashedPassword});
      await newOwner.save();
      res.send(`Welcome ${email}`)
  } else {
  res.send('user already existing');
  }
  } catch (error) {
    console.log('error:', error);
  }
});


//login owner
app.post('/owner/login', async(req, res) => {
  try{
  let {email, password} = req.body;
  let owner = await Owner.findOne({email});
  if(!owner) {
    res.send("user doesn't exist");
  } else {
    let result = await bcrypt.compare(password, owner.hashedPassword) 
    if(result === true) {
      const payload = {
        email: email
      };
     const jwtToken = jwt.sign(payload, 'secret');
      res.send({jwtToken});    
    } else {
      res.send("Invalid Password")
  }
}
} catch (error) {
  console.log('error:', error);
}
});

//to delete a owner
app.get('/owner/delete', authenticateUser, async(req, res) => {
  try{
    let {email} = req;
    let deletedOwner = await Owner.deleteOne({email});
    res.send('user deleted');
  } catch (error) {
    console.log('error:', error);
  }
});

//to add a post
app.post('/post', authenticateUser, async(req, res) => {
  try{
    let {email} = req;
    let owner = await Owner.findOne({email});
    let {image_url, title} = req.body;
    let randomNumber = Math.floor(Math.random() * 30) + 1;
    let views = randomNumber+'K';
    let {username} = req;
    let newPost = new Post ({
      ownerId: owner._id, image_url, title, views
    });
    await newPost.save();
    console.log(newPost);
    res.send('post created successfully');
  } catch (error) {
    console.log('error:', error);
  }
});

//to show a post
app.get('/post/:id', async (req, res) => {
  let {id} = req.params;
  let post = await Post.findById(id);
  res.send(post);
});

//to delete a post
app.get('/post/delete/:id', authenticateUser, async (req, res) => {
  let {id} = req.params;
  let deletedPost = await Post.findByIdAndDelete(id);
  console.log(deletedPost);
  res.send('post deleted');
});

//to show all posts
app.get('/post', async (req, res) => {
  let allPosts = await Post.find();
    res.send(allPosts)
});

//to update a post
app.post('/post/update/:id', authenticateUser, async (req, res) => {
  try{
    let {id} = req.params;
    let {image_url, title,} = req.body;
    await Post.findByIdAndUpdate(id, {image_url: image_url, title: title});
    await updatedPost.save();
  res.send('post updated successfully');
  } catch(error) {
    console.log(error)
  }
  });

//to test
app.get('/', (req, res) => {
    res.send('Hello')
});

app.listen(port, () => {
    console.log('listining on port', port);
});

module.exports = app;
