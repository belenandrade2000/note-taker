
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
 

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/notes.json',(err,data) => res.json(JSON.parse(data)));
  console.info(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const {title, text} = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile(path.join(__dirname,'./db/notes.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        fs.writeFile(
          path.join(__dirname,'./db/notes.json'),
          JSON.stringify(parsedNotes,null,4),
          (writeErr) =>{
            writeErr
            ? console.error (writeErr)
            : console.info("Succesfully created new note!")

            const response = {
              status: 'success',
              body: newNote,
            };
        
            console.log(response);
            res.status(201).json(response);
          }
        );
      }
    });

  } else {
    res.status(500).json('Error in posting a new note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);