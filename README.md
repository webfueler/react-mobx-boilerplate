# React Mobx App Boilerplate

Hey developer 👋

This is a repository with an example of a base application that can scale, using [Mobx](https://mobx.js.org/README.html) as state manager. 

Some considerations were done while creating this boilerplate:
- using classes for modules (OOP) instead of functional programming (could be refactored, but this is personal preference)
- Interface based implementation (easy to swap modules at any time, different modules between server and client side if required)
- made a simple [webpack](https://webpack.js.org/) configuration

## Developing
Install dependencies:
```bash
npm i
```

Start development server:
```bash
npm start
```

Production build
```bash
npm run build
```

## To Do:
- better styling (this is mainly showcasing architecture, not UI)
- add Server Side Rendering (SSR)
