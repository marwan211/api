const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const folderPath = path.join(__dirname, 'files');

// set up multer for file uploads
const upload = multer({ dest: folderPath });

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

// upload endpoint for images
app.post('/upload', upload.single('image'), function (req, res) {
  const imagePath = req.file.path;
  const imageName = req.file.originalname;

  // Move the file to the 'files' folder
  fs.rename(imagePath, path.join(folderPath, imageName), function (err) {
    if (err) {
      console.error(err);
      res.send('error');
    } else {
      console.log('File uploaded successfully');
      res.send('success');
    }
  });
});

// view endpoint for images
app.get('/view', function (req, res) {
  fs.readdir(folderPath, function (err, files) {
    if (err) {
      console.error(err);
      res.send('error');
    } else {
      const images = files.filter((file) =>
        ['.jpg', '.jpeg', '.png'].includes(path.extname(file))
      );
      const html = images
        .map((image) => `<img src="/files/${image}" />`)
        .join('');

      res.send(html);
    }
  });
});
app.get('/views', function(req, res) {
  const directoryPath = folderPath
  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    const fileNames = files.map(file => {
      return {
        name: file,
        url: `http://${req.headers.host}/filessss/${file}`
      }
    })
    res.send(fileNames);
  });
});


app.listen(3000);
