#!/bin/bash
# 只載入冷啟動必要的 3 個檔案，避免 context 膨脹
MEMORY_DIR="$(dirname "$0")"

echo "=== SESSION MEMORY LOADED ==="
echo ""
echo "--- STATUS ---"
cat "$MEMORY_DIR/STATUS.md"
echo ""
echo "--- BACKLOG ---"
cat "$MEMORY_DIR/BACKLOG.md"
echo ""
echo "--- PRINCIPLES ---"
cat "$MEMORY_DIR/PRINCIPLES.md"
echo ""
echo "=== END MEMORY ==="
