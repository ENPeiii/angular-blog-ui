/**
 * 載入 TUI Viewer (唯讀檢視器，含複製按鈕)
 * CSS 已在 styles.css 中全局載入，這裡只負責載入 JS 模組
 */
export async function loadTuiViewer() {
  // 先載入 Prism 及其插件
  const Prism = await import('prismjs').then((m) => m.default);

  // 載入 Prism 插件（順序重要：先 toolbar，再 copy-to-clipboard）
  await import('prismjs/plugins/toolbar/prism-toolbar.js');
  await import('prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js');

  // 載入常用的語言包
  await Promise.all([
    import('prismjs/components/prism-typescript.js'),
    import('prismjs/components/prism-javascript.js'),
    import('prismjs/components/prism-css.js'),
    import('prismjs/components/prism-json.js'),
  ]);

  // 動態載入核心套件
  const [Viewer, codeSyntaxHighlight, tableMergedCell] = await Promise.all([
    import('@toast-ui/editor/dist/toastui-editor-viewer').then((m) => m.default),
    import('@toast-ui/editor-plugin-code-syntax-highlight').then((m) => m.default),
    import('@toast-ui/editor-plugin-table-merged-cell').then((m) => m.default),
  ]);

  return { Viewer, codeSyntaxHighlight, tableMergedCell, Prism };
}
