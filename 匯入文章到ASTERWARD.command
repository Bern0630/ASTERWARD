#!/bin/zsh

set -u

project_dir="${0:A:h}"
cd "$project_dir" || exit 1

node_bin="$(command -v node 2>/dev/null || true)"
if [[ -z "$node_bin" ]]; then
  codex_node="/Users/bernardc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  if [[ -x "$codex_node" ]]; then
    node_bin="$codex_node"
  fi
fi

if [[ -z "$node_bin" ]]; then
  osascript -e 'display alert "找不到 Node.js" message "請先安裝 Node.js，再重新執行這個匯入工具。" as critical'
  read "?按 Enter 關閉視窗…"
  exit 1
fi

source_file="$(osascript <<'APPLESCRIPT'
try
  set chosenFile to choose file with prompt "選擇要加入 ASTERWARD 的 Markdown 文章" of type {"net.daringfireball.markdown", "net.multimarkdown.text", "public.plain-text"}
  return POSIX path of chosenFile
on error number -128
  return ""
end try
APPLESCRIPT
)"

if [[ -z "$source_file" ]]; then
  echo "已取消，沒有修改任何檔案。"
  exit 0
fi

"$node_bin" scripts/import-markdown.mjs "$source_file"
status=$?

if [[ $status -ne 0 ]]; then
  echo
  echo "匯入失敗，請查看上方錯誤訊息。"
  read "?按 Enter 關閉視窗…"
  exit $status
fi

echo
echo "文章已加入本機網站，瀏覽器將自動開啟。"
sleep 2
