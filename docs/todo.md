# Project Setup

- Improve setup workflow:
  - More detailed setup steps.
  - Fix find use usefuncs to work on Mac and Linux (-perm +111 broken?)
    - find . -type f -exec test -x {} \; -print
  - Create test accounts in test setup.
  - Better error message in test for missing test passwords.
- Switch to webpack to get complete sourcemap of TS files.
- Add additional clients:
  - A REPL (command-line) app.
  - A progressive web app.
  - React Native
  - Cordova
  - An Android app.
  - An iOS app.
  - A desktop app.
