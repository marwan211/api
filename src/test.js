const express = require('express')
const app = express()
// const port = process.env.PORT || 3001;

app.get('/', function (req, res) {
  res.send('Hello World')

})
 
app.get('/file',function(req,res){
    const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
s="init"
fs.mkdir(folderPath, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Folder created successfully');
    const filePath = path.join(folderPath, 'example.txt');
    fs.writeFile(filePath, 'This is an example text file.', (err) => {
      if (err) {
        console.error(err);
        res.write('error')
        s="error"
        // alert("file not create");
      } else {
        console.log('File created successfully');
        // alert("file create");
        res.write('success')
        s="success"
        
      }
    });
  }
   res.send(s)
  //  res.send("done 2")
});
})

app.listen(3000)
