import chokidar from "chokidar";
const EventEmitter = require("events").EventEmitter;
import fsExtra from "fs-extra";
import readLastLines from "read-last-lines";
import moment from "moment";

export class Watcher extends EventEmitter {
  constructor(private agents: string[], private targetFile: string) {
    super();
    this.watchFile(targetFile);
  }

  watchFile(targetFile: any) {
    try {
      const watcher = chokidar.watch(targetFile, { persistent: true });

      watcher.on("change", async (filePath) => {
        // Get update content of file, in this case is one line
        const updateContent = await readLastLines.read(filePath, 1);

        // emit an event when the file has been updated
        this.emit("file-updated", { message: updateContent });

        this.checkForChanges();
        // pipe a handler to the event
      });
    } catch (error) {
      console.log(error);
    }
  }

  //   read file and check for changes made by agents in within the last 5 seconds
  async checkForChanges() {
    // _id is timeStamp in ISO format and _source is the actual log entry get all the logs from the file made in the last 5 seconds
    const logs = await readLastLines.read(this.targetFile, 5);

    // seprate the logs by line and filter out the ones that are not from the agents we are watching
    const filteredLogs = logs.split("\n").filter((log) => {
      // "_id" of the log entry is a timestamp in ISO format so we can use it to extract entries from the last 5 seconds

      // using regex to get the value of _id from the log entry
      let logTime = log.match(/\"_id\":\"(.*?)\"/);

      const logTimeStamp = logTime && logTime[1];

      if (!logTimeStamp) {
        return;
      }

      const now = moment().unix();

      if (now - +logTimeStamp <= 5) {
        return log;
      }
    });

    // check for the agents that didn't have any log entries in the last 5 seconds

    this.agents
      .filter((agent) => {
        // regex to get check if the agent name is in the log entry
        const agentName = new RegExp(`\"name\":\"${agent}\"`);

        // check if filterdLogs has any log entries from the agent
        return !filteredLogs.some((log) => {
          return agentName.test(log);
        });
      })
      .forEach((agent) => {
        console.log(
          `[${new Date().toLocaleString()}] ${agent} has no log entries in the last 5 seconds`
        );
        console.log(
          `[${new Date().toLocaleString()}] ${agent} playing a beep sound`
        );
      });
  }
}
