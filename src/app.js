const express = require("express");
const cors = require("cors");

const { uuid , isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project id' })
  }
  return next()
}

function findRepositoryIndexById(id) {
  return repositories.findIndex(repository => repository.id === id)
}

app.use('/repositories/:id', validateProjectId)

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = { id: uuid(), title, url, techs, likes: 0 }
  
  repositories.push(repository)

  return response.status(200).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = findRepositoryIndexById(id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist '})
  }

  const repository = { ...repositories[repositoryIndex], title, url, techs }
  repositories[repositoryIndex] = repository

  return response.status(200).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = findRepositoryIndexById(id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist '})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = findRepositoryIndexById(id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exist '})
  }

  const repository = repositories[repositoryIndex]
  repository.likes += 1

  repositories[repositoryIndex] = repository

  return response.status(200).send(repository)

});

module.exports = app;
