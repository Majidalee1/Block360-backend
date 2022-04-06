import { Agent } from "./agent";
import { Watcher } from "./Watcher";

// create agents

const Agent1 = new Agent("Majid", "./log.json", 1000);
const Agent2 = new Agent("Sajid", "./log.json", 6000);

// create watcher

const Watcher1 = new Watcher();
Watcher1.subscribeToAgent(Agent1);
Watcher1.subscribeToAgent(Agent2);

// start watcher
Watcher1.start();
