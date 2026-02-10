#!/bin/bash

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

menu() {
    clear
    echo -e "${GREEN}=== 1Panel 应用管理菜单 ===${RESET}"
    echo -e "${GREEN}1) 自动化安装 1Panel${RESET}"
    echo -e "${GREEN}2) 卸载自动化 1Panel${RESET}"
    echo -e "${GREEN}0) 退出${RESET}"
    read -p $'\033[32m请选择操作: \033[0m' choice
    case $choice in
        1)
            echo -e "${GREEN}正在自动化安装 1Panel...${RESET}"
            curl -sSL https://install.lifebus.top/auto_install.sh | bash
            pause
            ;;
        2)
            echo -e "${GREEN}正在卸载 1Panel...${RESET}"
            curl -sSL https://install.lifebus.top/auto_uninstall.sh | bash
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
