const express = require('express');
const morgan = require('morgan');

const app = express();

// This an example of a middleware that requests pass through
// on their way to the final handler
app.use(morgan('dev'));

//This is an example of a final request handler
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
  res.send('We don\'t serve that here. Never call again!');
})

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    IP: ${req.ip}
  `;
  res.send(responseText);
});

app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if(!name) {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }

  if(!race) {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response 
  res.send(greeting);
});

app.get('/sum',(req,res)=>{
  let a = req.query.a;
  let b = req.query.b;

  if(!a){
    return res.status(400).send('Please provide a number for a');
  }else if(isNaN(a)){
    return res.status(400).send('That is not a valid number for a');
  }else{
    a = a * 1;
  }

  if(!b){
    return res.status(400).send('Please provide a number for b');
  }else if(isNaN(b)){
    return res.status(400).send('That is not a valid number for b');
  }else{
    b = b * 1;
  }

  const sum = a + b;

  res.send(`The sum of ${a} and ${b} is ${sum}.`)
});

app.get('/cipher',(req,res)=>{
  const text = req.query.text;
  let shift = req.query.shift;

  if (!text){
    return res.status(400).send('Please provide text')
  }

  if (!shift){
    return res.status(400).send('Please provide a value to shift by');
  }else if(isNaN(shift)){
    return res.status(400).send('The provided shift is not a valid number')
  }else{
    shift = shift * 1;
  }

  let encryptedString = "";
  for (let i =0;i<text.length;i++){
    // charCode 32 is " "
    if (text.charCodeAt(i) !== 32){
      encryptedString += String.fromCharCode(text.charCodeAt(i) + shift);
    }else{
      encryptedString += ' ';
    }
  }

  res.send(encryptedString);
});

app.get('/lotto',(req,res)=>{
  const arr = req.query.arr;

  const btwn1And20 = (array) =>{
    for(let i =0;i<array.length;i++){
      if (array[i] < 1 || array[i] > 20){
        return true;
      }
    }
  }

  if (!arr){
    return res.status(400).send('Please provide an array of values')
  }else if (!Array.isArray(arr)){
    return res.status(400).send('The provided values do not form an array')
  }else if(arr.length > 6){
    return res.status(400).send('More than 6 values have been provided')
  }else if(arr.length < 6){
    return res.status(400).send('Less than 6 values have been provided')
  }else if(btwn1And20(arr)){
    return res.status(400).send('The values provided contain at least one value not between 1 and 20')
  }

  let winningLotteryNumbers = [];
  for(let i = 0; i< 6; i++){
    let num = Math.floor(Math.random() * (20 - 1) + 1);
    while (winningLotteryNumbers.includes(num)){
      num = Math.floor(Math.random() * (20 - 1) + 1);
    }
    winningLotteryNumbers[i] = num;
  }

  let numberOfMatches = 0;
  for(let i =0; i<arr.length;i++){
    if (winningLotteryNumbers.includes(arr[i]*1)){
      numberOfMatches += 1
    }
  }
 
  let msg = "Sorry, you lose";
  if (numberOfMatches === 6){
     msg = 'Wow! Unbelievable! You could have won the mega millions!';
  }else if(numberOfMatches === 5){
    msg = "Congratulations! You win $100!";
  }

  res.send(`winningLotteryNumbers: ${winningLotteryNumbers}\nmsg: ${msg}\nmatches: ${numberOfMatches}`)
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});