#!/usr/bin/env bash
# 一键更新：git pull 后按改动类型自动完成数据同步、依赖安装、构建、重启与验证
# 用法（服务器网页终端）：cd /var/www/mixing-drinks && ./deploy/update.sh
set -euo pipefail

APP=/var/www/mixing-drinks
DB=mixing_drinks
SNAPSHOT="$APP/database/snapshot.sql"

cd "$APP"

# 0. 服务器若有未提交的本地改动，先停止，避免 git pull 冲突
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: 服务器存在未提交的改动，请先执行 git status 查看并处理。"
  exit 1
fi

OLD=$(git rev-parse HEAD)
git pull
NEW=$(git rev-parse HEAD)

changed() { ! git diff --quiet "$OLD" "$NEW" -- "$@"; }

# 1. 数据库快照：仅当本次 pull 中该文件有变化时才导入，导入前先备份现有库
if [ -f "$SNAPSHOT" ] && changed database/snapshot.sql; then
  if grep -qE 'Mixing drinks|cocktail_db' "$SNAPSHOT"; then
    echo "ERROR: 快照里仍有旧库名（Mixing drinks / cocktail_db），请先替换或删除 CREATE DATABASE / USE 行。"
    exit 1
  fi
  sudo mkdir -p /srv/backup
  sudo chown "$USER" /srv/backup
  sudo mysqldump --single-transaction --default-character-set=utf8mb4 "$DB" > "/srv/backup/pre-update-$(date +%F-%H%M%S).sql"
  echo "已备份当前数据库到 /srv/backup"
  sudo mysql --default-character-set=utf8mb4 "$DB" < "$SNAPSHOT"
  echo "已按 database/snapshot.sql 覆盖服务器数据"
fi

# 2. 依赖变化才重新安装
if changed server/package.json server/package-lock.json; then
  (cd "$APP/server" && npm install --omit=dev)
fi
if changed manage/package.json manage/package-lock.json; then
  (cd "$APP/manage" && npm install)
fi

# 3. 生产环境变量 + 前端构建
if [ ! -f "$APP/manage/.env.production" ]; then
  cp "$APP/manage/.env.production.example" "$APP/manage/.env.production"
  echo "已从模板生成 manage/.env.production"
fi
if [ ! -f "$APP/manage/dist/index.html" ] || changed manage/src manage/public manage/.env.production.example manage/vite.config.ts manage/index.html manage/package.json; then
  (cd "$APP/manage" && npm run build)
fi

# 4. 保证上传目录存在且 www-data 可写
mkdir -p "$APP/server/public/uploads" "$APP/manage/public/images/upload"
sudo chown -R www-data:www-data "$APP/server/public/uploads" "$APP/manage/public/images"

# 5. 网关与进程配置变化才更新
if changed deploy/nginx.mixing.conf; then
  sudo cp "$APP/deploy/nginx.mixing.conf" /etc/nginx/sites-available/mixing
  sudo ln -sf /etc/nginx/sites-available/mixing /etc/nginx/sites-enabled/mixing
  sudo nginx -t && sudo systemctl reload nginx
fi
if changed deploy/mixing.service; then
  sudo cp "$APP/deploy/mixing.service" /etc/systemd/system/mixing.service
  sudo systemctl daemon-reload
fi

# 6. 重启后端并验证
sudo systemctl restart mixing
systemctl is-active mixing
curl -fsS http://127.0.0.1:3000/api/v1/health
echo
echo "更新完成：$OLD -> $NEW"
