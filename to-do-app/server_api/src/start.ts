import {TodoServer} from "./todo-server.js";
import fs from "fs";
const SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const SERVER_HOST = process.env.HOST ?? 'localhost';

const DB_FILE_PATH = process.env.DB_FILE_PATH ?? 'db.json';


const todoServer: TodoServer = TodoServer.start(
  {
    port: SERVER_PORT,
    host: SERVER_HOST,
    dbConfig: {
      dbFilePath: DB_FILE_PATH
    }

  },
  () => console.log(`Server started on port ${SERVER_PORT}: http://${SERVER_HOST}:${SERVER_PORT}`),
  () => console.log('Server stopped'),
  (err) => console.error(err)
)

// register signal handlers to stop the server gracefully
function stopServer() {
  todoServer.stop();
  process.exit(0); // exit the process with success
}
// SIGINT is sent when the user presses Ctrl+C - manuel interruption by a user
process.on('SIGINT', stopServer);
// SIGTERM is sent by the system when the process is terminated - e.g. by a systemd service or docker stop
process.on('SIGTERM', stopServer);
