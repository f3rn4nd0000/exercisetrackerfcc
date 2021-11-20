const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

let list_of_users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users/', (req,res) => {
  res.send(list_of_users);
});

// LOG precisa ser um novo objeto, veremos como fazer
app.get('/api/users/:_id/logs', (req,res) =>{
  res.json({
    username: req.body.username,
    count: parseInt(req.body.count),
    _id: req.body._id,
    log: [{
      description: req.body.description,
      duration: parseInt(req.body.duration),
      date: req.body.date,  
    }]
  });
});
  
app.post('/api/users/', (req,res) => {
  let new_user = {};
  let myUsername = req.body.username;
  let list_of_exercises = [];
  let myId = Date.now().toString(36) + Math.random().toString(36).substr(2);

  new_user['username'] = myUsername;
  new_user['_id'] = myId;
  new_user['exercises'] = list_of_exercises;
  list_of_users.push(new_user);
  
  res.json({
    username: myUsername,
    _id: myId,
  });
});

app.post('/api/users/:_id/exercises', (req,res) => {
  console.log(req.params._id);
  let new_exercise = {};
  // let indexToInsert = list_of_users.indexOf(req.params._id);
  let indexToInsert = list_of_users.findIndex(x => x._id === req.params._id);
  console.log(indexToInsert);
  //o objeto exercise terá estes 3 campos preenchidos que depois serao inseridos no index correspondente da lista de users
  new_exercise['description'] = req.body.description;
  new_exercise['duration'] = parseInt(req.body.duration);
  new_exercise['date'] = new Date(req.body.date).toString();
  console.log(new_exercise);
  //insere dados na lista de exercicios e depois na lista de usuarios  
  list_of_exercises.push(new_exercise);
  list_of_users[indexToInsert]['exercises'] = list_of_exercises;

  if(new Date(req.body.date).toDateString() === 'Invalid Date')
    new_exercise['date'] = new Date().toDateString();
  
  res.json({
    username: list_of_users[indexToInsert]['username'],
    exercises: list_of_users[indexToInsert]['exercises'],
    _id: list_of_users[indexToInsert]['_id']
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on http://localhost:' + listener.address().port)
});
