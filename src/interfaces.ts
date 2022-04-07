export interface LogEntry {
  _id: string;
  _version: number;
  _score: null;
  _source: {
    "@timestamp": string;
    agent: {
      name: string;
      hostname: string;
      message: string;
      "event.created": string[];
    };
  };
}
