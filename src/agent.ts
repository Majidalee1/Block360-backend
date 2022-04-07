import { writeFileSync } from "fs";
import moment from "moment";
import { LogEntry } from "./interfaces";

export interface AgentImplementation {
  name: string;

  writeToLogfile: (message: string) => void;
  startWriting: () => void;
}

// consructor type

type AgentInfo = {
  name: string;
  interval: number;
  logfile: string;
};

type AgentConstructor = new (agentInfo: AgentInfo) => AgentImplementation;

export class Agent implements AgentImplementation {
  // set agent alive status

  constructor(
    public name: string,
    private logFile: string,
    private interval: number
  ) {
    this.startWriting();
  }

  public writeToLogfile(message: string) {
    const logEntry: LogEntry = {
      // currnet timestamp
      _id: moment().unix().toString(),
      _version: 1,
      _score: null,
      _source: {
        "@timestamp": new Date().toISOString(),
        agent: {
          name: this.name,
          hostname: "your laptop/server hostname",
          message: `Info [${new Date().toISOString()}] ${
            this.name
          } logging, number=${Math.floor(Math.random() * 1000000)}`,
          "event.created": [new Date().toISOString()],
        },
      },
    };
    writeFileSync(this.logFile, JSON.stringify(logEntry) + "\n", {
      flag: "a",
    });
  }

  // write recurring log entries
  async startWriting() {
    setInterval(() => {
      this.writeToLogfile(
        `Info [${new Date().toISOString()}] ${
          this.name
        } logging, number=${Math.floor(Math.random() * 1000000)}`
      );
    }, this.interval);
  }
}
