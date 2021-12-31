import { Node } from '@tiptap/core';

export const Introduction = Node.create({
  name: 'introduction',

  content: 'paragraph+',
  group: 'block',

  parseHTML() {
    return [{ tag: 'introduction' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['introduction', HTMLAttributes, 0];
  },

  addNodeView() {
    return () => {
      const dom = document.createElement('div');
      dom.classList.add('introduction');

      return {
        dom,
        contentDOM: dom,
      };
    };
  },
});
