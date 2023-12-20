# CS-554 Final Project

## Prerequisites
To run this web application you must have [node.js (including npm)](https://nodejs.org/en/download/current) and [firebase cli](https://firebase.google.com/docs/cli) installed on your machine.

## To run
Create a config file in the firebase directory (@/firebase/config.ts).
Place your Firebase configuration settings in there which you can get from Firebase Console.
You may also have to execute ```firebase login``` in your shell.

Then install node modules
```
npm i
```

Then run the following commands in separate terminals:
```
npm start
```
node server.mjs
```

## Note
Running npm start will simultaneously start the next.js app as well as the firebase emulators.
The emulators will be automatically seeded with data stored in a top-level directory called 'emulator-data'.
On exit the firestore emulator will save changes you have made to that same directory so they persist next time you run the app. If you don't want this behavior you can run ```npm run start-no-save```.
Also all seeded accounts have the password 'password' if you'd like to access them.

Running the 'node server.mjs' will enable socket.io in order to send posts between users and the people they follow.


## Reference Documentation
HTML Canvas:
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

Colorwheel:
https://casesandberg.github.io/react-color/

Material Tailwind:
https://www.material-tailwind.com/

Firestore:
https://firebase.google.com/docs/firestore/quickstart

Socket.io:
https://socket.io/docs/v4/