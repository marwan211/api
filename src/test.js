const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'files');

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/file', function (req, res) {
  fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error(err);
      res.send('error');
    } else {
      console.log('Folder created successfully');
      const filePath = path.join(folderPath, 'example.txt');
      console.log(filePath);
      fs.writeFile(filePath, 'This is an example text file.', (err) => {
        if (err) {
          console.error(err);
          res.send('error');
        } else {
          console.log('File created successfully');
          res.send('success');
        }
      });
    }
  });
});

app.get('/read', function (req, res) {
  const filePath2 = path.join(folderPath, 'example.txt');
  fs.readFile(filePath2, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.send('error');
    } else {
      console.log('File read successfully');
      res.send(data);
    }
  });
});

app.listen(3000);