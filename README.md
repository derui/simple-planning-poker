# Simple Planning Poker #
This project provides functions to do planning poker in online.

## Features ##

- Sign in/Sign up with email/password
- Create game with story points, or some numbers what you want
- Join voting
- Change user name/mode
- Show average estimations after show down

# Development #

## Libraries ##
- React.js
- Wouter
- Vite
- Vitest
- jotai
- vanilla-css

## Requirement ##

- Node >= 22
- Firebase project you have own
- pnpm (recommended using latest version)
- JRE >= 17
  - To run firebase emulators
- Taskfile
  - `brew install go-task` on macOS, other platforms can install like `taskfile` 

## Prerequirement ##
You should login to firebase before to start development.

```sh
$ pnpm i
$ npx firebase login
$ npx firebase init
```

You must select below in `npx firebase init`:

- Realtime database
- Hosting
- Emulator

> NOTICE: Please do not overwrite firebase.json in a process of initialization. If you overwrite it, this project can not run correctly.

## For nix user ##
This repository maintains flake.nix to create build environment a minute. We recommends use `direnv` to enable devShell on the fly.

## Make config file for local development ##
Create `firebase.config.ts` into `src`. Content of it like below.

```javascript
export const firebaseConfig = { projectId: "foobar", apiKey: "api" };
```

It is recommended that the projectId in `firebase.config.ts` be set to the same value as the one in `.firebaserc`.

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
