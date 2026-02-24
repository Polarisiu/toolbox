#!/bin/bash

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

menu() {
    clear
    echo -e "${GREEN}=== 网络工具菜单 ===${RESET}"
    echo -e "${GREEN}1) 路由追踪 nexttrace${RESET}"
    echo -e "${GREEN}2) 网络测速 speedtest${RESET}"
    echo -e "${GREEN}0) 退出${RESET}"
    read -p $'\033[32m请选择操作: \033[0m' choice
    case $choice in
        1)
            echo -e "${GREEN}正在运行 nexttrace 路由追踪...${RESET}"
            curl -sL nxtrace.org/nt | bash
            pause
            ;;
        2)
            echo -e "${GREEN}正在运行 speedtest 网络测速...${RESET}"
            bash <(curl -sL https://raw.githubusercontent.com/sistarry/toolbox/main/VPS/Speedtest.sh)
            pause
            ;;
        0)
            exit 0
            ;;
        *)
            echo -e "${RED}无效选择，请重新输入${RESET}"
            sleep 1
            menu
            ;;
    esac
}

pause() {
    read -p $'\033[32m按回车键返回菜单...\033[0m'
    menu
}

menu
