import helloWorld from './foo/foo.js';

// To support acquisition of dynamically imported tiptap extension (and the editor)
import { AnyExtension, Editor } from '@tiptap/core';

// Some utility function
import useContentModel from './utils/useContentModel.js';

// Vue related stuff
import { createApp, h } from 'vue';
import App from './vue/App.js';

// Arbritary internal module
helloWorld();

// Some module to visualize content model of the editor
const { showContentModel } = useContentModel();

// Some Vue application
const app = createApp({
  render: () => h(App),
});
app.mount(`#vue`);

// dynamic import that pulls in a remote tiptap extension
const element = document.querySelector<HTMLDivElement>('#editor')!;

// In this experimental setup, all extensions will be served from `LiveServer`
const locator = (ext: string): string => `http://127.0.0.1:5501/remote-extensions/${ext}/dist/${ext}.esm.js`;

// The document that is loaded here: `scenario-1.json` describes two things
// 1. It holds the metadata information for the section/block that is about to be loaded
// 2. It holds the actual content of that section/block itself
fetch('/scenario-1.json')
  .then((response) => response.json())
  .then((content) => {
    // acquire Promises for remote extensions as specified in the meta-data
    const remoteExtensions: Promise<any>[] = content.extensions.map((ext: string): Promise<any> => {
      return import(locator(ext));
    });

    // then have all Promises resolve to get the complete set of actual extensions
    Promise.all(remoteExtensions).then((resolvedExtensions) => {
      const extensions: AnyExtension[] = [];

      // for resolved, loaded extensions
      // - create an inline plugin if one is set-up
      // - configure the plugin if specific configuration has been set-up
      resolvedExtensions.forEach((resolvedExtension) => {
        let extension = resolvedExtension.default;

        if (content.inlineExtensions[extension.name]) {
          extension = introduceInlineExtension(extension, content);
        }

        if (content.configuration[extension.name]) {
          applyExtensionConfiguration(extension, content);
        }

        extensions.push(extension);
      });

      console.info('Initializing the runtime editor...');

      // Everything ready now initialize our dynamic, runtime editor
      new Editor({
        element,
        extensions,
        content,

        onCreate({ editor }) {
          console.log('Document schema: ', JSON.stringify(editor.schema.spec, null, 2));
          console.log('Loaded document valid =', editor.state.doc.check() === undefined);
          showContentModel(editor);
        },

        onUpdate({ editor }) {
          showContentModel(editor);
        },
      });

      function introduceInlineExtension(extension: AnyExtension, content: any): AnyExtension {
        logInfo('Inline extension', extension, content.inlineExtensions);
        return extension.extend(content.inlineExtensions[extension.name]);
      }

      function applyExtensionConfiguration(extension: AnyExtension, content: any): void {
        logInfo('Apply configuration', extension, content.configuration);
        extension.configure(content.configuration[extension.name]);
      }

      function logInfo(info: string, extension: AnyExtension, holder: any): void {
        console.info(`${info}: ${extension.name}\n`, JSON.stringify(holder[extension.name], null, 2));
      }
    });
  });
