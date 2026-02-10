#!/bin/bash

GREEN="\033[32m"
RED="\033[31m"
RESET="\033[0m"

menu() {
    clear
    echo -e "${GREEN}=== 1Panel 应用拓展菜单 ===${RESET}"
    echo -e "${GREEN}1) 国外机 1Panel 添加应用${RESET}"
    echo -e "${GREEN}2) 国内机 1Panel 添加应用${RESET}"
    echo -e "${GREEN}3) 萌森软件拓展${RESET}"
    echo -e "${GREEN}0) 退出${RESET}"
    read -p $'\033[32m请选择操作: \033[0m' choice
    case $choice in
        1)
            echo -e "${GREEN}正在为国外机 1Panel 添加应用...${RESET}"
            bash <(curl -fsSL https://raw.githubusercontent.com/Polarisiu/panel/main/1papps.sh)
            pause
            ;;
        2)
            echo -e "${GREEN}正在为国内机 1Panel 添加应用...${RESET}"
            bash <(curl -fsSL https://raw.githubusercontent.com/Polarisiu/panel/main/cn1papps.sh)
            pause
            ;;
        3)
            echo -e "${GREEN}正在运行萌森软件拓展...${RESET}"
            bash <(curl -fsSL https://raw.githubusercontent.com/Polarisiu/panel/main/ms1papps.sh)
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
