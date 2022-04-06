import { Subscribable } from "./subscribable_base";
import { Agent } from "./agent";

// There must be a watcher that will continuously monitor the log file log.json
// and notify the subscribers when the agent is alive.

// The watcher must generate alerts if there is no entry against an agent for 5 seconds. The
// alerts include:
// a. Send an alert email with the agent name that is not writing to the file.
// b. Play a different alert beep for each agent to identify the agent which has stopped
// writing

export interface WatcherImplementation {
  subscribeToAgent(agent: Agent): void;
  unsubscribeFromAgent(agent: Agent): void;
  start(): void;
  checkAgentAlive(agent: Agent): void;
  notifyAgentAlive(agent: Agent): void;
}

export class Watcher
  extends Subscribable<string>
  implements WatcherImplementation
{
  private agents: Set<Agent> = new Set();

  public subscribeToAgent(agent: Agent) {
    this.agents.add(agent);
  }

  public unsubscribeFromAgent(agent: Agent) {
    this.agents.delete(agent);
  }

  public start() {
    setInterval(() => {
      this.agents.forEach((agent) => {
        this.checkAgentAlive(agent);
      });
    }, 5000);
  }

  public checkAgentAlive(agent: Agent) {
    if (!agent.isAlive()) {
      this.notifyAgentDead(agent);
    } else {
      this.notifyAgentAlive(agent);
    }
  }

  public notifyAgentAlive(agent: Agent) {
    this.notify(`${agent.name} is alive`);
  }

  public notifyAgentDead(agent: Agent) {
    console.log(`Sending Email to ${agent.name}`);
    console.log(`Playing beep for ${agent.name}`);
    // this.notify(`${agent.name} is dead`);
  }
}
