# Acquire tiptap extensions through dynamic imports

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