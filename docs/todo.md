# Bugs

- Not recording emails in user profile (except email and password)?
  - Missing scope?
- Fix find use usefuncs to work on Mac and Linux (-perm +111 broken?)
  - find . -type f -exec test -x {} \; -print

# Project Setup

- Improve setup workflow:

  - Create test accounts in test setup or config script (remove manual setup).
  - Better error message in test for missing test passwords.
  - Implement Admin role user - use to cleanup from tests.
  - Use a Material Design theme
- Switch to webpack to get complete sourcemap of TS files.
- Add additional clients and UI front ends.
  - A REPL (command-line) app.
  - Polymer.
  - React.
  - React Native
  - Cordova
  - An Android app.
  - An iOS app.
  - A desktop app.
  
# App Features

- Atttendees progressive feedback.
  - Slider of quality responses (terrible, poor, neutral, good, great)
  - Interesting, awesome, confused/lost, can't hear
    can't see.
- Audience I have a question (queue).
  - Queue only OR post question.
  - Allow upvoting/downvoting posted questions (like Moderator).
- Public notes/comments.
  - Displayed on local screen and/or presenter screen.
- Vote up/down public notes/comments.
- Attendee-to-attendees features.
  - Bookmark attendee.
  - Message attendee.
  - Swap details (business card exchange).
- Edit my profile
  - Change display name.
  - Update profile picture.
  - Add phone #
  - Publishable email
  - Publishable home page url
  - Twitter account (is there a signInWithTwitter?).
- Add Groups (event series).
  - Customize user-profile per group (including display name
    and which profile data shared) (persona)

