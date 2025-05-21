# To-Do App

This is a simple to-do application built with TypeScript and JavaScript.
The app allows users to manage their tasks by creating, editing, deleting, and marking them as done.
It also supports sorting and filtering tasks based on various criteria.

## Team members
- Muaaz Ahmed Shahzad
- Mohamad Badr H.Ali

## Prerequisites

Before building and running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (for running the containerized version)

## Installation

1. Clone the repository:
   ```bash
   git clone git@git.thm.de:praktische-informatik-2-ss25/to-do-app.git
   cd to-do-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Build

To build the project, run:
```bash
npm run build
```

This will compile the TypeScript code into JavaScript and place the output in the `build` directory.

## Start

To start the project, run:
```bash
npm start
```

This will launch the application on `http://localhost:8080` by default.

## NPM Scripts
The following NPM scripts are available:

Create a production-ready build for both client and server:
```bash
npm run build:prod
```

Build the Docker image for the application:
```bash
npm run build:docker
```

Start the application in a Docker container
```bash
npm run start:docker
```

Build the Docker image and start the application with Docker Compose for the first time:
```bash
npm run firststart:compose
```

Start the application with Docker Compose (after the initial build):
```bash
npm run start:compose
```

Stop the Docker Compose services:
```bash
npm run stop:compose
```

## Build and Start with Docker Compose
1. Install dependencies with `npm run install`.
2. Build the production version with `npm run build:prod`.
3. Start the application using Docker Compose:
```bash
  npm run firststart:compose
```
Or, if the application is already built, start it with:
```bash
  npm run start:compose
```
4. To stop the application:
```bash
  npm run stop:compose
```
