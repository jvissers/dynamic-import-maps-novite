import helloWorld from './foo/foo.js';

// To support acquisition of dynamically imported tiptap extension (and the editor)
import { AnyExtension, Editor } from '@tiptap/core';

// Standard extensions (loaded from import-maps)
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';

import useContentModel from './utils/useContentModel.js';

// Arbritary internal module
helloWorld();

// Some module to visualize content model of the editor
const { showContentModel } = useContentModel();

// dynamic import that pulls in a remote tiptap extension
const editorSlot = document.querySelector<HTMLDivElement>('#editor')!;
const extensions: AnyExtension[] = [Document, Paragraph, Text];
let intro = 'remote-extensions/extension-introduction/dist/extension-introduction.esm.js';
import(`http://127.0.0.1:5501/${intro}`).then((m) => {
  extensions.push(m.default);
  new Editor({
    element: editorSlot,
    extensions,
    content: '<introduction><p>Introduction</p></introduction><p>Hello World</p>',

    onCreate({ editor }) {
      console.log('Document schema: ', JSON.stringify(editor.schema.spec, null, 2));
      console.log('Loaded document valid =', editor.state.doc.check() === undefined);
      showContentModel(editor);
    },

    onUpdate({ editor }) {
      showContentModel(editor);
    },
  });
});
