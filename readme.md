# Block 360 Backend Challenge

Implementation of an environment with multiple Agents Writing to a file and a watcher for changes and agents status 

## How to get started


```
npm i && npm start
```



## IMPLEMENTATION DETAILS

A class Agent to create Agent entities with Custom interval of writing to a file, Starts writing to a file once and instance is created

A Class watcher that gets and array of agents an file Name to be watched, it detect changes to file and pipes a function to it, once a change is detected, we read the file and get the entries made that are previous made by agents, then we check the time on which the entry is made by specific Agent

```
If now - lastEntryTime > 5 seconds

````

We notify the agent via email for it's unavailability and play a beep sound

## Note

Implementation of beep sound and emails are handled by simple console logs
