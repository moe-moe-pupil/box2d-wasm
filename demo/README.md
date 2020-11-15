# Demo

There are a variety of demos in this directory, which aim to show you how to integrate `box2d-wasm` into your application.

## [Classic](classic)

Demonstrates how to install box2d-wasm into a plain old webpage.

No build system, no UI framework, no TypeScript. Just npm.  
Imports Box2D.js via tag-loading (i.e. `<script src="Box2D.js" />`).

This is a similar approach to that used in the [`box2d.js`](https://github.com/kripken/box2d.js) repository.

Uses JSDoc comments to give you the benefit of the TypeScript typings, without needing to actually write or build TypeScript.

## [Svelte + Rollup + TypeScript](svelte-rollup-ts)

[Rollup](https://rollupjs.org/guide/en/) build system, [Svelte](https://svelte.dev/) as UI framework, [TypeScript](https://www.typescriptlang.org/).  
Imports Box2D.js via ES import (i.e. `import Box2DFactory from 'box2d-wasm';`).