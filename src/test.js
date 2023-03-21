const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')

})
 
app.get('/file',function(req,res){
    const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');

fs.mkdir(folderPath, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Folder created successfully');
    const filePath = path.join(folderPath, 'example.txt');
    fs.writeFile(filePath, 'This is an example text file.', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File created successfully');
      }
    });
  }
  res.send("done")
});
})

app.listen(3000)