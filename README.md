# Simple Planning Poker #
This project provides functions to do planning poker in online.

# Requirement #

- Node >= 14
- Firebase project you have own
- yarn >= 1.22
- JRE >= 1.8
  - To run firebase emulators


# Development #

## Prerequirement ##
You should login to firebase before to start development.

```sh
$ yarn
$ yarn run firebase login
$ yarn run firebase init
```

You must select in initialization below:

- Realtime database
- Hosting
- Emulator

> NOTICE: Please do not overwrite firebase.json in a process of initialization. If you overwrite it, this project can not run correctly.

## Run test ##

```sh
$ yarn test

# want to watch source and run test

$ yarn test:watch
```

> NOTICE: Use jest and swc in this project to improve test executing speed, so it has no type checking in test. You should check type consistency of test.

## Lint ##

```sh
# for TypeScript
$ yarn lint:ts
# for CSS
$ yarn lint:css

# Lint all
$ yarn lint
```

## Start entire development environment ##

The command below run emulators of firebase, webpack-dev-server, and postcss watcher.

```sh
$ yarn start
```

Then open `localhost:5000` to see top page.

# Publish to Firebase #

## Prerequirement ##
You put `firebase.config.prod.ts` into under `src/ts`.

`firebase.config.prod.ts` export `firebaseConfig` that like object below.

```javascript
export const firebaseConfig = {
  apiKey: "api key",
  authDomain: "auth domain",
  projectId: "project id",
  storageBucket: "bucket",
  messagingSenderId: "sender id",
  databaseURL: "database url",
  appId: "app id",
};
```

You can get the object from your firebase console.

## Publish to preview ##

> Notice: This feature is based on beta feature of Firebase Hosting.

```sh
$ yarn publish:preview
```

Open your firebase console of Hosting, then you can find preview URL.

## Publish to production ##

```sh
$ yarn publish:production
```

And you can open application from your app URL!

# LICENSE #
MIT
