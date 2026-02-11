#!/bin/bash

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

TG_URL="https://raw.githubusercontent.com/sistarry/toolbox/main/toy/vpstgbf.sh"
GH_URL="https://raw.githubusercontent.com/sistarry/toolbox/main/toy/githubbackup.sh"

run_script() {
    url=$1
    name=$2

    echo -e "${GREEN}正在启动 ${name}...${RESET}"
    bash <(curl -fsSL "$url")
    pause
}

pause() {
    read -p $'\033[32m按回车返回菜单...\033[0m'
    menu
}

menu() {
    clear
    echo -e "${GREEN}================================${RESET}"
    echo -e "${GREEN}       文件/目录备份管理        ${RESET}"
    echo -e "${GREEN}================================${RESET}"
    echo -e "${GREEN} 1) Telegram备份${RESET}"
    echo -e "${GREEN} 2) GitHub备份${RESET}"
    echo -e "${GREEN} 0) 退出${RESET}"
    read -p $'\033[32m 请选择 (0-2): \033[0m' choice

    case $choice in
        1) run_script "$TG_URL" "Telegram 备份" ;;
        2) run_script "$GH_URL" "GitHub 备份" ;;
        0) exit 0 ;;
        *)
            echo -e "${RED}输入错误${RESET}"
            sleep 1
            menu
            ;;
    esac
}

menu
