#!/bin/bash
# ========================================
# AllinSSL 一键管理脚本 (Docker Compose)
# ========================================

GREEN="\033[32m"
RESET="\033[0m"
YELLOW="\033[33m"
RED="\033[31m"
APP_NAME="allinssl"
APP_DIR="/opt/$APP_NAME"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"
CONFIG_FILE="$APP_DIR/config.env"


get_public_ip() {
    local ip
    for cmd in "curl -4s --max-time 5" "wget -4qO- --timeout=5"; do
        for url in "https://api.ipify.org" "https://ip.sb" "https://checkip.amazonaws.com"; do
            ip=$($cmd "$url" 2>/dev/null) && [[ -n "$ip" ]] && echo "$ip" && return
        done
    done
    for cmd in "curl -6s --max-time 5" "wget -6qO- --timeout=5"; do
        for url in "https://api64.ipify.org" "https://ip.sb"; do
            ip=$($cmd "$url" 2>/dev/null) && [[ -n "$ip" ]] && echo "$ip" && return
        done
    done
    echo "无法获取公网 IP 地址。"
}


SERVER_IP=$(get_public_ip)

function menu() {
    clear
    echo -e "${GREEN}=== AllinSSL 管理菜单 ===${RESET}"
    echo -e "${GREEN}1) 安装启动${RESET}"
    echo -e "${GREEN}2) 更新${RESET}"
    echo -e "${GREEN}3) 卸载 (含数据)${RESET}"
    echo -e "${GREEN}4) 查看日志${RESET}"
    echo -e "${GREEN}5) 重启${RESET}"
    echo -e "${GREEN}0) 退出${RESET}"
    read -p "$(echo -e ${GREEN}请选择:${RESET}) " choice
    case $choice in
        1) install_app ;;
        2) update_app ;;
        3) uninstall_app ;;
        4) view_logs ;;
        5) restart_app ;;
        0) exit 0 ;;
        *) echo -e "${RED}无效选择${RESET}"; sleep 1; menu ;;
    esac
}

function install_app() {
    read -p "请输入宿主机端口 [默认:7979]: " input_port
    PORT=${input_port:-7979}

    read -p "请输入管理员用户名 [默认:allinssl]: " input_user
    USERNAME=${input_user:-allinssl}

    read -p "请输入管理员密码 [默认:allinssldocker]: " input_pwd
    PASSWORD=${input_pwd:-allinssldocker}

    read -p "请输入 ALLINSSL_URL [默认:allinssl]: " input_url
    ALLINSSL_URL=${input_url:-allinssl}

    mkdir -p "$APP_DIR/data"

    cat > "$COMPOSE_FILE" <<EOF
services:
  allinssl:
    image: allinssl/allinssl:latest
    container_name: allinssl
    restart: unless-stopped
    ports:
      - "$PORT:8888"
    environment:
      - ALLINSSL_USER=$USERNAME
      - ALLINSSL_PWD=$PASSWORD
      - ALLINSSL_URL=$ALLINSSL_URL
    volumes:
      - $APP_DIR/data:/www/allinssl/data
EOF

    echo "PORT=$PORT" > "$CONFIG_FILE"
    echo "ALLINSSL_USER=$USERNAME" >> "$CONFIG_FILE"
    echo "ALLINSSL_PWD=$PASSWORD" >> "$CONFIG_FILE"
    echo "ALLINSSL_URL=$ALLINSSL_URL" >> "$CONFIG_FILE"

    cd "$APP_DIR"
    docker compose up -d

    echo -e "${GREEN}✅ AllinSSL 已启动${RESET}"
    echo -e "${YELLOW}🌐 访问地址: http://${SERVER_IP}:$PORT${RESET}"
    echo -e "${YELLOW}🔗 安全入口: http://${SERVER_IP}:$PORT/$ALLINSSL_URL${RESET}"
    echo -e "${GREEN}📂 数据目录: $APP_DIR/data${RESET}"
    echo -e "${GREEN}🔑 管理员账号: $USERNAME  密码: $PASSWORD${RESET}"
    read -p "按回车返回菜单..."
    menu
}

function update_app() {
    cd "$APP_DIR" || { echo "未检测到安装目录，请先安装"; sleep 1; menu; }
    docker compose pull
    docker compose up -d
    echo -e "${GREEN}✅ AllinSSL 已更新并重启完成${RESET}"
    read -p "按回车返回菜单..."
    menu
}

function uninstall_app() {
    cd "$APP_DIR" || { echo "未检测到安装目录"; sleep 1; menu; }
    docker compose down -v
    rm -rf "$APP_DIR"
    echo -e "${GREEN}✅ AllinSSL 已卸载，数据已删除${RESET}"
    read -p "按回车返回菜单..."
    menu
}

function view_logs() {
    docker logs -f allinssl
    read -p "按回车返回菜单..."
    menu
}

function restart_app() {
    cd "$APP_DIR" || { echo "未检测到安装目录"; sleep 1; menu; }
    docker compose restart
    echo -e "${GREEN}✅ AllinSSL 已重启${RESET}"
    read -p "按回车返回菜单..."
    menu
}

menu
