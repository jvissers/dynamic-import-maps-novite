import { defineConfig } from 'rollup';

export default defineConfig({
    external: [
        '@tiptap/core'
    ],
    input: './out-tsc/index.js',
    output: {
        dir: './dist',
        entryFileNames: 'tangelo-introduction.esm.js'
    }
});