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
Steps to set up the repo for deployment of a staging version of Firebase-Checkin 

>>> make sure you are running bash 
> bash 
$ sudo  aptget install nodejs
$ sudo  apt-get install  npm 
# npmjs.com 
$ git clone https://github.com/mckoss/firebase-checkin.git
$ cd firebase-checkin.git
$ source tools/use
$ mkdir configs
$ firebase login
: go to firebase.google.com - create a project (click on button on website) 
$ configure-project

$ source tools/use
$ configure-project
  - pick repo  ( fir-checkin-koss ) 
  - pick stage ( "staging"  ) 
$ set-config
  - select "staging"
  - go to the firebase console
  - select select the "add firebase to your web app"
  - paste into the script	
$ build-project
  - 
  - Need to set up testing users to run tests. 
  - go to firebase , enable google and email and auth options on console
  - add users:  testuser01@example.com , testuser02@example.com on the firebase website
  - add  users to configs/staging.ts


```
testuser01@example.com
testuser02@example.com
```

Make up a (the same) password for these - put in the configs/staging.ts file
like so:

```
  "testAccountPassword": "foobar"
```
$ run-tests
$ run-browser-test
$ go to localhost:8888 
---

#Deploy onto production 
$ deploy-project 

# firebase hosting - add official URL  
# Go to Hosting on website
# click on "add custom domain "
# 
# ===========================
# production database  - add official database 
$ set-config production 
# remove testing password from config file 
$ build-project
$ deploy-project 

```



# Resources

```
Demo:
https://checkin-staging.firebaseapp.com/#event=gdg

Code Lab Hints:
https://github.com/mckoss/firebase-checkin/pull/1/files
```
