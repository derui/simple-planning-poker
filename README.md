# Simple Planning Poker #
This project provides functions to do planning poker in online.

# Requirement #

- Node >= 16
- Firebase project you have own
- pnpm (recommended using latest version)
- JRE >= 1.8
  - To run firebase emulators

# Libraries #

- React.js
- React Router
- Vite
- Vitest
- Redux Toolkit & React-Redux & Redux-Observable
- twind

# Development #

## Prerequirement ##
You should login to firebase before to start development.

```sh
$ pnpm i
$ npx firebase login
$ npx firebase init
```

You must select in initialization below:

- Realtime database
- Hosting
- Emulator

> NOTICE: Please do not overwrite firebase.json in a process of initialization. If you overwrite it, this project can not run correctly.

## Run test ##

```sh
$ pnpm run test

# want to watch source and run test

$ pnpm run test:watch
```

## Lint ##

```sh
$ pnpm run lint
```

## Start entire development environment ##

The command below run firebase emulators, tsc for type checking, and vite to build.

```sh
$ pnpm run start
```

Then open `localhost:5173` to see top page.

## Run End 2 End Test ##

```sh
$ pnpm run ci
# In other terminal
$ npx playwright test
```

Sources of e2e tests are under `tests` directory.

## storybook ##

You can start the storybook with the following command.

```sh
$ pnpm run storybook
```

If you want to add stories, or modify current stories, you edit `.stories.tsx` files under `src` directory.

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
$ pnpm run publish:preview
```

Open your firebase console of Hosting, then you can find preview URL.

## Publish to production ##

```sh
$ pnpm run publish:production
```

And you can open application from your app URL!

# LICENSE #
MIT
