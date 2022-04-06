import { writeFileSync } from "fs";
import { Subscribable } from "./subscribable_base";

export interface AgentImplementation {
  //   public isAlive(): boolean;
  // pirvate name
  name: string;
  isAlive: () => boolean;
  writeToLogfile: (message: string) => void;
}

// consructor type

type AgentInfo = {
  name: string;
  interval: number;
  logfile: string;
};

type AgentConstructor = new (agentInfo: AgentInfo) => AgentImplementation;

export class Agent extends Subscribable<string> implements AgentImplementation {
  alive!: boolean;

  // set agent alive status

  constructor(
    public name: string,
    private logFile: string,
    private interval: number
  ) {
    super();
    this.writeToLogfile(`${this.name} is alive`);
    // check if interval is greater than 5 seconds
    this.setAlive(this.interval <= 5000);
  }

  public isAlive(): boolean {
    return this.alive;
  }

  public setAlive(alive: boolean) {
    this.alive = alive;
  }

  public writeToLogfile(message: string) {
    const logEntry = {
      _id: new Date().getTime().toString(),
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

    this.notify(JSON.stringify(logEntry));

    setInterval(() => {
      writeFileSync(this.logFile, JSON.stringify(logEntry, null, 2), {
        flag: "a",
      });
    }, this.interval);
  }
}
