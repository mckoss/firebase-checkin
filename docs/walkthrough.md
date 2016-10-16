# Code Structure for Firebase-Checkin
_Updated: October 2016_

This document explains the structure of the Firebase-Checkin sample
app.

/src
├── app.ts
├── checkin.ts
├── config.ts -> ../configs/testing.ts
├── data-model.ts
├── test
│   ├── checkin-test.ts
│   └── helpers.ts
└── util.ts

| File | Description |
| ---- | ----------- |
| *checkin.ts* | This is the main (UI-less) application.  `Checkin` |
|              | is responsible for connecting to the backend database and |
|              | sending state-updates to all callers to `Checkin#listen()` |
| ---- | ----------- |
| *app.ts* | This is a simple web-app which works in conjunction with |
|          | `app/index.html` to render the state changes signaled by `Checkin` |
|          | into styled DOM nodes. |
| *util.ts* | Simple utities for Object manipulation. |
| *config.ts* | A (symbolically linked) file with the current project's |
|           | Firebase SDK configuration data. |
| *data-model.ts* | Typescript type definitions for entities stored in Firebase. |
|               | These mirror database type definitions from `checkin.bolt`. |
