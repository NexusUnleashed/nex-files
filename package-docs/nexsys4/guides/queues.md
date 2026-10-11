---
title: Queues
description: Queue commands so they fire the moment you have balance, using nexSys's free, class, and other queues.
---

# Queues

Achaea can hold commands in a queue and run them the moment you have the
balance they need. nexSys manages these queues for you: you add commands,
and nexSys keeps the game's queue up to date and notices when it fires.

## Queueing from the command line

| Command | What it does |
| --- | --- |
| `qa <command>` | Add a command to the end of the free queue. |
| `qp <command>` | Put a command at the front of the free queue. |
| `qcp <command>` | Put a command at the front of the class queue. |
| `dor <command>` | Repeat a command every time the free queue fires. `dor` on its own stops. |

Adding a command that's already queued does nothing, so pressing an alias
twice doesn't queue the action twice.

## The queues

| Queue | Use it for | Achaea queue type |
| --- | --- | --- |
| `free` | Most actions that need balance and equilibrium | `free` |
| `class` | Class abilities that use your class balance | `c!p!t!w` |
| `full` | Actions that need balance, equilibrium, and class balance | `ebc!w!p!t` |
| `shield` | Shielding | `eb!w!t` |
| `ship` | Ship commands | `s!w!t` |
| `bloodcloak` | Bloodcloak | `!teb` |
| `battlerage` | Battlerage abilities | `!p!t!wu` |
| `stun` | Actions to take as soon as you're no longer stunned | `!t` |

The type tells the game when to fire the queue. Type `HELP QUEUE` in game for
what each letter means.

Some queues replace each other. Sending the free queue clears anything
waiting in the full, shield, and bloodcloak queues, and each of those clears
the others in the same way.

## What happens when a queue fires

When you add a command, nexSys sends the queue's whole contents to the game
with `QUEUE ADDCLEAR`. When the queue fires, the game runs, in order:

1. nexSys's housekeeping commands, including `stand`,
2. nexSys's own automatic actions (free queue only): class cures and
   defences that need balance or equilibrium,
3. commands you put at the front,
4. the rest of your commands.

nexSys then clears its copy of the queue and announces that the queue fired.

The queued commands travel to the game joined by your in-game command
separator. If they run straight away instead of waiting, that separator
matches the Nexus Command Stack Delimiter. See
[Troubleshooting](../troubleshooting.md#queued-commands-run-straight-away).

## Queues and pausing

While nexSys is paused, queued commands wait and go out as soon as you
resume. Switch on **Queue while paused** on the System tab to keep queues
working while paused. Queues also wait until nexSys has finished starting
up.

## For scripters

Each queue is available by name under `nexSys.api.queue`:

```js
const { queue } = nexSys.api;

queue.free.add("touch tree"); // append; ignored if already queued
queue.free.add(["wield sword", "kill rat"]); // several commands
queue.free.prepend("stand"); // put at the front
queue.free.addClear("kill rat"); // replace your commands, keep the front ones
queue.free.isQueued("kill rat"); // true or false
queue.free.clearQueue(); // clear it here and in the game

queue.list(); // ["classQueue", "freeQueue", ...]
queue.inspect("free"); // current contents
```

| Method | Clears |
| --- | --- |
| `clear()` | nexSys's copy only. The game's queue is left as it is. |
| `clearQueue()` | nexSys's copy and the game's queue (`CLEARQUEUE`). |

Every queue also answers to its internal id, so `queue.freeQueue` is the same
as `queue.free`. Pass `{ allowDuplicate: true }` to `add()` to queue a
command that's already there.

### Queue events

Three events mark the stages of a queue command:

| Event | Meaning |
| --- | --- |
| `nexsys4.queue.flushed` | nexSys sent the queue to the game. JavaScript only, through `nexSys.events.on`. |
| `nexsys4.queue.sent` | The game accepted it (`[System]: Added ... to your ... queue.`). |
| `nexsys4.queue.fired` | The queue fired. |

`sent` and `fired` also have per-queue versions, such as
`nexsys4.queue.fired.free`. This runs a function every time the free queue
fires:

```js
eventStream.registerEvent(
  "nexsys4.queue.fired.free",
  () => {
    // the free queue just fired
  },
  { id: "my-free-queue-fired" },
);
```

See [Events](../reference/events.md) and the
[API reference](../reference/api.md#apiqueue).
