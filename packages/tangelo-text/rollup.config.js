import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default defineConfig({
    external: [
        '@tiptap/core'
    ],
    input: './out-tsc/index.js',
    output: {
        dir: './dist',
        entryFileNames: 'tangelo-text.esm.js'
    },
    plugins: [nodeResolve()]
});