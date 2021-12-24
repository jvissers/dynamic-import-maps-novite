# Acquire tiptap extensions through dynamic imports

**See bottom of the page for latest updates**

This vanilla TypeScript project shows how (remote) tiptap modules can be acquired through dynamic imports.
These dynamically loaded tiptap modules, themselves are depending on other modules (most noteably `@tiptap/core`).
To satisfy these (secondary) dependencies, used by dynamically imported modules, this project uses **importmaps**.

This project effectively has two parts:

1. a **main** project, consisting of an `index.html` and a `src/main.ts` file.
2. a **tiptap extension** project, consisting of `packages/extension-introduction/src/introduction.ts, index.ts`.

## Main project

The main project's `index.html` declares the `es-module-shims.js` module.
This module enables `importmaps` in all browsers that support `ES6 modules`.
**Note: that the `shim-mode` is used so that this indeed works across browsers.**

The main project uses three (standard) tiptap extensions (document, paragraph, text) which are not dynamically imported.
Additionally it uses the `extension-introduction` tiptap extension which is loaded through `dynamic import`.
These 4 extensions, together define the tiptap `Editor` which is started in `main.ts`.

## tiptap extension project ##

This is a very simple tiptap extension that defines a `Introduction` node as part of the schema.
The extensions uses `@tiptap/core`, and/but the ES6 module that is created from it, declares this as something `external`.
This means that at runtime (in the application), this `@tiptap/core` depencency needs to be resolved somehow.
The _main project_ uses **importmaps** for this.
The extension project leverages [rollup.js](https://rollupjs.org/) to build the ES6 module.
This module is then subsequently copied to the `remote-extensions` location/directory in the project.
This will be the directory, serviced through `LiveServer` from which dynamic imports are resolved. 

## Testing 

1. Go to the folder `packages/extension-introduction and run
    - `pnpm run clean` => cleans out any old stuff
    - `pnpm run build` => constructs the `extension-introduction-esm.js` module (from TypeScript sources)
    - `pnpm run copy`  => this copies the above `ES6 module` to the `remote-extensions` location

2. To to the `root` folder and run
    - `pnpm run clean` => cleans out any old stuff
    - `pnpm run build` => creates the distribution build (from TypeScript sources)
    - `pnpm run live`  => starts `LiveServer` and opens `index.html` from root in the browser

After this you should see a tiptap `Editor` window.
You can also check the browser DevTools network tap, to see what all is loaded.

## Recent Updates

** Update December 10th, 2021 **
While revisiting this setup, looked again at the reason why initially we used _shim mode_.
In an other projects, I was only able to get stuff working with that mode (in dev).
The problem with that though is that the entry point `index.html` no longer is processed by `vitejs`.
The reason for this is that the module declaration for shim mode looks something like this:

```
      <script type="module-shim" src="/dist/main.js"></script>
```

After having another go at using _polyfill mode_, I noticed that in **this** particular project,
that doesn't use `vitejs`, stuff still works.

**Notes**
1. In Google Chrome, no additional console error will appear
2. In FF, an additional console error will appear (which can be ignored, according to the manual) \
   The message that is seen is: `Uncaught TypeError: Error resolving module specifier “@tiptap/core”. Relative module specifiers must start with “./”, “../” or “/”.` \
   See [es-module-shims](https://www.npmjs.com/package/es-module-shims) for additional information.

For this the `index.html` looks something like this:

```
<html>
  <head>
     <script type="importmap">
       // Your import map statements here
     </script>
     ...
  <head>
  <body>
     ...
     <script type="module" src="/src/main.ts"></script>
     ...
  </body>
</html>
```

Will do another attempt in a project that **does** use `vitejs`.

** Update December 10th, 2021 **
Checking the above in the project that **does** use `vitejs` shows that this does not work in FF, Chrome dev mode nor FF production mode.
Only Chrome production mode works in that setup.

** Update December 10th, 2021 **
The problem with CDN import maps of tiptap apparently aren't support in production.
See detail of this [skypack issue](https://github.com/skypackjs/skypack-cdn/issues/159)

A way to mitigate the above issue, is to use **local** sources instead of CDN.
For this purpose all necessary dependencies are installed locally as **dev dependencies**.
Subsequently through `pnpm run copy` the required ES6 module files are copied to `/dist/js`.
And the `index.html` importmap is changed accordingly.
Now running `pnpm run live` still works, resolving dependencies locally instead of through CDN.

** Update December 10th, 2021 **
A result of this vanilla setup, where no bundler (like `vitejs`) is used, is that it becomes more challenging to work with some frameworks.
For instance **Vue3** uses _SIFC_ (SIngle File Component) mechanism.
Basically this a single file where `template`, `script` and `styles` are collecated in a single `.vue` file.
It is possible to use Vue without this SIFC approach, whilst still working with the latest version capabilities (e.g. Composition API).
The fact of the matter is, is that working with these files is indeed a bit more challenging.
In this update, I've added a Vue component in `vue`, which uses a CDN reference in the importmap.
Note that there is a tool called `htm` that might make working with these components (especially templates) somewhat easier.

** Update December 24th, 2021 **
As the trail to use vitejs combined with importmaps and dynamic imports seem to get colder, looked into `htm`.
In this update I actually use `htm` to create the Vue `App` component.
For additional information check [the npm page](https://www.npmjs.com/package/htm).
