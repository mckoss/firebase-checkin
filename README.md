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
- Design the client app interface and local application state.
- Implement a UI-less (biz logic) application with unit tests.
- Create a simple web app that displays the local app state and interacts with
  the user to call UI-less app methods.

# Building this Repo

- Dependencies: This repo is tested to work on Linux and Mac. You need to
  install [node.js](https://nodejs.org/en/download/) version 4 or later (run
  `node --version` to see what is already installed).
- Visit [console.firebase.google.com](https://console.firebase.google.com)
- Create a new project - you'll be asked for the
  [project id](https://console.firebase.google.com/project/_/settings/general/) when
  you run the the `set-config` script.
- Enable
  [Authentication](https://console.firebase.google.com/project/_/authentication/providers)
  using Google and Email providers (and optionally Facebook - which will require
  you setting up a Facebook application).
- Add two
  [email accounts](https://console.firebase.google.com/project/_/authentication/users)
  for use by the unittests (give them the same password you make up):
    - testuser01@example.com
    - testuser02@example.com

This respository has some automation scripts to help install dependencies.  To
make it easy to run them, you first `source` the `tools/use` script to setup
your local environment variables and `PATH`:

```
$ source tools/use
```

The following commands will configure this repository to use the firebase project
you setup above as well as copy the intialization keys that the Firebase SDK needs
to associate your application with your project:

```
$ configure-project        # Install npm dependencies and firebase configs
```

You'll be asked to copy and paste a code snippet - you can find it by clicking
the "Add Firebase to your web app" button on the
[project overview](https://console.firebase.google.com/project/_/overview) page.

You should now be ready to build the project (using the TypeScript compiler),
and run the unit tests.

```
$ build-project       # Runs TypeScript, Browserify, and updates Security Rules
$ run-tests           # Runs all Unittests locally (using node.js)
$ run-browser-test    # Starts a web server - and opens the browser-test.
```

If you just want to run the web application from localhost:

```
$ firebase serve
```

# Server Configurations

By default, this repo is setup to deploy to the `testing` configuration.  But
it is typical to have separate `staging` and `production` projects (with their
own databases and user accounts).

There are two places in this repo that store configuration information.

```
.firebaserc - Alias names for the different projects like this:
{
  "projects": {
    "staging": "checkin-staging",
    "production": "checkin-b58f3",
    "testing": "checkin-staging"
}}
```

Each of these aliases also has Firebase SDK configuration information in the
`configs` directory:

```
configs
├── current
├── production.ts
├── staging.ts
└── testing.ts
```

These SDK configuration files are selected by using the `set-config` script.  It
will also prompt you to copy and paste the SDK code snippet to intialize a config
file when it is first created.

To deploy to the _current_ configuration (copies all files to the project hosting
site, and updates the Security Rules):

```
$ deploy-project
```

# Resources

```
Demo:
https://checkin-staging.firebaseapp.com/#event=gdg

Code Lab Hints:
https://github.com/mckoss/firebase-checkin/pull/1/files
```
