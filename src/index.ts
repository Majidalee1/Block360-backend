import { Agent } from "./agent";
import { Watcher } from "./Watcher";
import * as fs from "fs";

// create agents

const fileName = "log.json";

// check if file exists
if (!fs.existsSync(fileName)) {
  fs.writeFileSync(fileName, "");
}

const Agent1 = new Agent("Majid", fileName, 1000);
const Agent2 = new Agent("Sajid", fileName, 6000);

// create watcher
const watcher = new Watcher([Agent1.name, Agent2.name], fileName);
