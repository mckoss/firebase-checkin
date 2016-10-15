# Firebase-Checkin - sample app for meetup check-ins.

This sample app will demonstrate how design a Firebase app
by:

- Design the server-side data model.
- Secure and validate the model with Rules.
- The Typescript toolchain for node and browser:
  - npm
  - tsc
  - browserify
  - VSCode
- Design the client app interface and local
  application state.
- Implement a UI-less (biz logic) application
  with unit tests.
- Create a simple web app that displays the
  local app state and interacts with the user
  to call UI-less app methods.

# Building this Repo

Create a new firebase project at firebase.google.com (you'll be asked for it's name
in the set-config script).

You need to setup two testing accounts in the firebase console (Auth tab).  You also need
to enable Authenticating with Google and Email (and optionally with Facebook).

E.g. https://firebase.corp.google.com/project/_/authentication/providers

```
$ source tools/use
$ configure-project
$ set-config
$ build-project
$ run-tests
```


```
testuser01@example.com
testuser02@example.com
```

Make up a (the same) password for these - put in the configs/staging.ts file
like so:

```
  "testAccountPassword": "foobar"
```


# Resources

```
Demo:
https://checkin-staging.firebaseapp.com/#event=gdg

Code Lab Hints:
https://github.com/mckoss/firebase-checkin/pull/1/files
```
