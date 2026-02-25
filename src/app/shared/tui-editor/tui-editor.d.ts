// CSS 模組宣告
declare module '*.css' {
  const content: string;
  export default content;
}
// Toast UI Editor CSS
declare module '@toast-ui/editor/dist/toastui-editor-viewer';
declare module '@toast-ui/editor/dist/toastui-editor.css';
declare module '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

// PrismJS 主題
declare module 'prismjs';
declare module 'prismjs/themes/prism-tomorrow.css';
declare module 'prismjs/themes/*.css';

// PrismJS 語言元件
declare module 'prismjs/components/prism-typescript.js';
declare module 'prismjs/components/prism-javascript.js';
declare module 'prismjs/components/prism-css.js';
declare module 'prismjs/components/prism-json.js';
declare module 'prismjs/components/*.js';

// PrismJS 插件
declare module 'prismjs/plugins/toolbar/prism-toolbar.js';
declare module 'prismjs/plugins/toolbar/prism-toolbar.css';
declare module 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';

// prism-themes
declare module 'prism-themes/themes/*.css';
