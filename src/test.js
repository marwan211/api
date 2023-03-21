const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const date = new Date().toISOString().replace(/:/g, '-');
    cb(null, `${date}-${file.originalname}`);
  }
});

// Set up multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
}).single('image'); // The name of the file input field on the form

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      if (!req.file) {
        res.status(400).send("No file selected for upload");
      } else {
        res.send({
          message: "File uploaded successfully",
          filename: req.file.filename
        });
      }
    }
  });
});

app.get('/view/:filename', function(req, res) {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'files', filename);
  
    // Check if file exists
    if (fs.existsSync(imagePath)) {
      // Set content type based on file extension
      const extname = path.extname(imagePath);
      let contentType;
      switch (extname) {
        case '.jpg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        default:
          contentType = 'application/octet-stream';
      }
  
      // Read file and send as response
      fs.readFile(imagePath, function(err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.set('Content-Type', contentType);
          res.send(data);
        }
      });
    } else {
      res.status(404).send('File not found');
    }
  });
  app.get('/view', function(req, res) {
    const directoryPath = path.join(__dirname, 'files');
    fs.readdir(directoryPath, function(err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      const fileNames = files.map(file => {
        return {
          name: file,
          url: `http://${req.headers.host}/files/${file}`
        }
      })
      res.send(fileNames);
    });
  });
  // ...
  
  app.listen(3000, function () {
    console.log('Server started on port 3000');
  });