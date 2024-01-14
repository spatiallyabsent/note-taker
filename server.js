const express = require('express');
const path = require('path');
const fs = require("fs");
const { v4: uuidv4} = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// returns index.html for all other routes
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// returns the notes file on get request    
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));

});

//api routes
// managing reading and returing the db.json file. the return is a JSON object
app.get('/api/notes', (req, res) => {

    let dbPath = path.join(__dirname, '/db/db.json')
    fs.readFile(dbPath, 'utf-8',(err, data) => {
        if (err) {
            console.log("Inside /api/notes get while reading file");
            console.log(err);
            return res.status(500).json('Error reading notes');
        }
        res.json(JSON.parse(data));
    });
});

// handles the creation of new notes and writes them to the db.json file
app.post('/api/notes', (req, res) => {
    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text
    };
    console.log(newNote);
    console.log('Generated ID:', newNote.id);//testing to make sure the uuid is working properly
    let dbPath = path.join(__dirname, '/db/db.json')
    fs.readFile(dbPath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error inside post /api/notes");
            console.log(err);
            return res.status(500).json('Error reading notes');
        } else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote);

            fs.writeFile(dbPath, JSON.stringify(parsedNotes), (err) => {
                if (err) {
                    console.log("Error inside post writefile");
                    console.log(err);
                    // res.status(500).send('Error saving notes');
                } else {
                    console.log(`Note with title "${newNote.title}" is now written to JSON`);
                    const response = {
                        status: 'working as intended',
                        body: newNote,
                    };
                    console.log(response);
                    res.status(201).json(response);
                }
            });
        }
    });
});

// to delete files
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let dbPath = path.join(__dirname, '/db/db.json')
    fs.readFile(dbPath, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error inside delete");
            console.log(err);
            return res.status(500).json('Error reading notes');
        }

        const parsedNotes = JSON.parse(data);
        
        const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);
        

        fs.writeFile(dbPath, JSON.stringify(updatedNotes), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json('Error writing notes');
            }

            console.log(`Note with ID ${noteId} has been removed`);
            res.status(200).json({ status: 'success', note_id: noteId });
        });
    });
});

//directing get requests to html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// server start function
app.listen(PORT, () => {
    console.log(`server on Port ${PORT}`);
});
