#!/usr/bin/env bash

# Exit immediately if any command fails
set -e

# Setup formatting colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}   n8n Custom AI Nodes - Installer Script     ${NC}"
echo -e "${BLUE}==============================================${NC}"

# 1. Check prerequisites
echo -e "\n${YELLOW}[1/4] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed. Please install Node.js (v18+) to continue.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "  - Node.js version: ${GREEN}${NODE_VERSION}${NC}"

# Detect package manager
PKG_MANAGER="npm"
if command -v bun &> /dev/null; then
    PKG_MANAGER="bun"
fi
echo -e "  - Detected package manager: ${GREEN}${PKG_MANAGER}${NC}"

# 2. Install dependencies
echo -e "\n${YELLOW}[2/4] Installing development dependencies...${NC}"
if [ "$PKG_MANAGER" = "bun" ]; then
    bun install
else
    npm install
fi
echo -e "${GREEN}✅ Dependencies installed successfully.${NC}"

# 3. Build project
echo -e "\n${YELLOW}[3/4] Compiling TypeScript source files and copying assets...${NC}"
if [ "$PKG_MANAGER" = "bun" ]; then
    bun run build
else
    npm run build
fi
echo -e "${GREEN}✅ Build completed successfully.${NC}"

# 4. Link package to local n8n custom directory
echo -e "\n${YELLOW}[4/4] Registering package inside n8n custom directory...${NC}"
node scripts/link-local.js

# Post-install message
echo -e "\n${BLUE}==============================================${NC}"
echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
echo -e "${BLUE}==============================================${NC}"
echo -e "\n${YELLOW}💡 Next steps to activate custom nodes:${NC}"
echo -e "  1. Restart your local n8n instance to reload the new nodes:"
echo -e "     - If running via PM2:      ${GREEN}pm2 restart n8n${NC} (or your pm2 app name)"
echo -e "     - If running via systemd:  ${GREEN}sudo systemctl restart n8n${NC}"
echo -e "     - If running globally:     Stop your current ${GREEN}n8n start${NC} process and run it again"
echo -e "\n${YELLOW}🔍 How to verify the installation:${NC}"
echo -e "  1. Open your n8n dashboard in your browser."
echo -e "  2. Create a new workflow or open an existing one."
echo -e "  3. Click '+ Add First Step' (or '+ Add Node' / search bar)."
echo -e "  4. Look for the following nodes:"
echo -e "     - ${GREEN}OpenCode${NC} (under Advanced AI section)"
echo -e "     - ${GREEN}9Router${NC} (under Advanced AI section)"
echo -e "\n${YELLOW}🛠 Troubleshooting:${NC}"
echo -e "  - Check your n8n startup logs to see if there are any errors loading custom nodes:"
echo -e "    - PM2 logs command: ${GREEN}pm2 logs n8n${NC}"
echo -e "    - Systemd logs command: ${GREEN}journalctl -u n8n -n 100 --no-pager${NC}"
echo -e "  - Ensure that the user running n8n has permissions to read the ${GREEN}~/.n8n/custom${NC} folder."
echo -e "=============================================="
