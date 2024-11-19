## Server Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| [README.md](./README.md) | Everything about the server | **READ ME** carefully! |
| [app.js](./app.js) | JavaScript entry point for Express application | Import new routes/controllers |
| `controllers/` | Implementation of Express endpoints | Define new route handlers |
| `models/` | [Mongoose](https://mongoosejs.com/) models | Define data schema |
| [tests/server.postman_collection.json](tests/server.postman_collection.json) | [Postman test scripts](https://learning.postman.com/docs/postman/scripts/test-scripts/) | Replace with your exported Postman test collection |
| [docs/FAQ.md](docs/FAQ.md) | List of FAQs | Find answers to common questions |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | List of problems and solutions | Find solutions for common error messages |
| [package.json](package.json) | Project meta-information | — |

## Requirements

* [Node.js](https://nodejs.org/en/download/) (>=v18) Installation instructions for [Linux](https://github.com/nodesource/distributions), use installers for macOS and Windows (don't forget to restart your Bash shell)
* [MongoDB](https://www.mongodb.com/download-center/community?jmp=nav) (>=6) must be running locally on port 27017
* [Postman](https://www.getpostman.com/downloads/) (>=v8) for API testing

## Project setup

Make sure, you are in the server directory `cd server`

Installs all project dependencies specified in [package.json](./package.json).

```bash
npm install
```

## Start the server with auto-restarts for development

Automatically restarts your server if you save any changes to local files.

```bash
npm run dev
```

## Start the server

```bash
npm start
```

## Run the Postman Tests

Starts a new server on another port (default `3001`) and runs the `server` postman test collection against a test database (default `serverTestDB`).

```bash
npm test
```
