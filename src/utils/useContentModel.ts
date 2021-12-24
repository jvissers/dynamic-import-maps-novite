import { Editor } from '@tiptap/core';

export default () => {
  /**
   * Takes the `editor` and acquires the underlying ProseMirror JSon respresentation.
   *
   * @param editor the editor instance to show the content model for
   * @param querySelector a selector for where to put the content model in (defaults to `pre code`).
   */
  const showContentModel = (editor: Editor, querySelector: string = 'pre code'): void => {
    document.querySelector(querySelector)!.textContent = '\n' + JSON.stringify(editor.getJSON(), null, 2);
  };

  return {
    showContentModel,
  };
};
