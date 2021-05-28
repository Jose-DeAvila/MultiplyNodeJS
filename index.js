const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const config = require('./config');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const apiRouter = require('./routes/apiRouter');

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();
const mongoURL = config.MONGO_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
}, (error) => {
 if(error) throw error
  console.log('Connected');
});

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api', apiRouter);

app.get('/appPrestamos/dashboard', (req, res) => {
  res.render('dashboard');
})

app.get('/', (req, res) => {
  res.send('<p>¿Where do you want to go? <a href="/appPrestamos/">Loans App</a> or <a href="/calculator/">Multiply</a></p>');
})

app.post('/calculator/result', (req, res) => {
  const numberToMultiply = req.body.number;
  let textToInsert = `Result \n`;
  for(let i = 0; i<=10; i++){
    textToInsert += `${numberToMultiply} * ${i} = ${numberToMultiply*i} \n`;
  }
  fs.writeFile(`${path.join('public', 'calculator','MultiplyResult.txt')}`, textToInsert, (err) => {
    if(err) throw err;
    console.log('File created successfully');
  });
  let textToResponse = `
    <h1 class="title">Multiply Result</h1>
    <h3 class="subtitle">Result</h3>
    <div class="values">
  `
  for(let i = 0; i<=10; i++){
    textToResponse += `<p class="line"><i>${numberToMultiply}</i> * <i>${i}</i> = ${numberToMultiply*i}</p>`
  }
  textToResponse += '</div>';
  res.send(`
    <head>
      <title>Multiply Result</title>
      <link rel="stylesheet" href="css/styleResult.css" media="all">
    </head>
    <body>
      <div class="btnDownload">
        <a href="./MultiplyResult.txt" download="MultiplyResult.txt">Download</a>
      </div>
      <div class="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path id="svg_path" fill="#0099ff" fill-opacity="1" d="M0,224L26.7,234.7C53.3,245,107,267,160,256C213.3,245,267,203,320,176C373.3,149,427,139,480,122.7C533.3,107,587,85,640,101.3C693.3,117,747,171,800,197.3C853.3,224,907,224,960,224C1013.3,224,1067,224,1120,234.7C1173.3,245,1227,267,1280,256C1333.3,245,1387,203,1413,181.3L1440,160L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path></svg>
      </div>
      <div class="goBack">
       <img src="img/monster.gif" alt="">
       <a href="/calculator" class="btnBack"><span>←</span>Go Back</a>
      </div>
      <div class="container">
        ${textToResponse}
      </div>
    <script src="js/main.js"></script>
    </body>`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
