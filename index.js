// implement your API here

const express = require("express");

const server = express();

const port = 5000;
const users = require("./data/db.js");

server.use(express.json());
server.listen(port, () => console.log(`listening on port : ${port}`));

server.get("/api/users", (req, res) => {
  users
    .find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err =>
      res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved." })
    );
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  users
    .findById(id)
    .then(user => res.status(200).json(user))
    .catch(err =>
      res
        .status(500)
        .json({ message: "The user with the specified ID does not exist." })
    );
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;

  users
    .insert({ name, bio })
    .then(newUser => {
      !name || !bio
        ? res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
          })
        : res.status(201).json(newUser);
    })
    .catch(err =>
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      })
    );
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  users
    .remove(id)
    .then(removedUser => {
      !removedUser
        ? res
            .status(404)
            .json({ message: "The user with the specified ID does not exist." })
        : res.status(200).json(removedUser);
    })
    .catch(err =>
      res.status(500).json({ errorMessage: "The user could not be removed" })
    );
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  users
    .update(id, { name, bio })
    .then(updatedUser => {
      !updatedUser
        ? res
            .status(404)
            .json({ message: "The user with the specified ID does not exist." })
        : !name || !bio
        ? res
            .status(400)
            .json({ errorMessage: "Please provide name and bio for the user." })
        : res.status(200).json(updatedUser);
    })
    .catch(err =>
      res
        .status(500)
        .json({ errorMessage: "The user information could not be modified." })
    );
});
