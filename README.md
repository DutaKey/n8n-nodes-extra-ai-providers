# n8n-nodes-extra-ai-providers

🚀 **Extend your n8n workflows with powerful AI providers not found in the official nodes.**

This package provides a collection of custom n8n nodes designed to seamlessly integrate various AI providers like **OpenCode**, **9Router**, and more into your self-hosted n8n environment.

## 🌟 Key Features

- **More Providers**: Access AI models beyond the default n8n offering.
- **Modular Design**: Easy to maintain and expand with new providers.
- **Standard Authentication**: Consistent API Key handling across all nodes.
- **Easy Setup**: Minimal configuration required to get started.

## 📦 Included Nodes

- **OpenCode**: Interact with OpenCode AI models for chat completions.
- **9Router**: Access 60+ AI providers via the 9Router routing proxy.

## 📋 Prerequisites

Before installing, ensure you have:
- **Node.js** (v18.x or later is recommended) or **Bun** installed on your system.
- **n8n** (compatible with versions `^1.0.0` or `^2.x.x`) installed locally, globally, or running in Docker.
- Proper read/write permissions for your user on the n8n data directory (default: `~/.n8n/`).

---

## 🛠 Installation

Choose the installation method that matches your n8n setup:

### 1. One-Step Automatic Installation (Recommended for Local / VM / PM2)

If you are running n8n on a local machine or server/VM (e.g. managed by PM2 or systemd), you can use the automated installer script:

1. Clone this repository and navigate to the project directory:
   ```bash
   git clone https://github.com/DutaKey/n8n-nodes-extra-ai-providers.git
   cd n8n-nodes-extra-ai-providers
   ```
2. Run the installer script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
   *This script automatically checks your prerequisites, installs devDependencies, compiles TypeScript files, cleans stale directories, and registers the node in your `~/.n8n/custom/` folder using NPM `--omit=peer` to avoid VM sandbox conflicts.*
3. Restart your n8n instance (see [Verification & Troubleshooting](#-verification--troubleshooting) below).

### 2. Docker-Compose Setup

For standard Docker-Compose setups, mount the compiled `dist` folder of this package to your n8n custom nodes directory and configure the environment variable:

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    environment:
      - N8N_CUSTOM_EXTENSIONS=/data/custom
    volumes:
      - /path/to/n8n-nodes-extra-ai-providers/dist:/data/custom
```

### 3. Docker + NPM (Custom Docker Image)

If you run n8n inside a Docker container using a custom image where n8n is installed via NPM, you can build and bake the custom nodes package directly into the image:

1. Create or update your `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine

   # Install n8n globally
   RUN npm install -g n8n --omit=dev

   # Set up the custom nodes directory structure
   WORKDIR /home/node/.n8n/custom
   RUN npm init -y

   # Copy this package source into the image
   COPY . /usr/src/n8n-nodes-extra-ai-providers

   # Build the package and install it locally
   RUN cd /usr/src/n8n-nodes-extra-ai-providers && npm install && npm run build
   RUN npm install /usr/src/n8n-nodes-extra-ai-providers --omit=dev

   # Configure n8n environment
   ENV N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
   
   USER node
   EXPOSE 5678
   CMD ["n8n", "start"]
   ```
2. Build and run your container:
   ```bash
   docker build -t custom-n8n-with-nodes .
   docker run -p 5678:5678 custom-n8n-with-nodes
   ```

---

## 🔍 Verification & Troubleshooting

### Restarting n8n

After linking or installing the nodes, you **must** restart n8n to load the new modules:
- **PM2**: `pm2 restart n8n` (or your PM2 process name/all)
- **Systemd**: `sudo systemctl restart n8n`
- **Docker**: `docker-compose restart n8n` (or restart the docker container)
- **Local NPM run**: Stop the active `n8n start` command (`Ctrl+C`) and start it again.

### Verifying Nodes Exist in UI

1. Open your n8n dashboard in your browser.
2. Create a new workflow or open an existing one.
3. Click **"+ Add First Step"** (or click the plus icon to add a sub-node to an AI Agent/Chain).
4. Search for the following custom nodes:
   - **OpenCode** (under Advanced AI section)
   - **9Router** (under Advanced AI section)

### Troubleshooting Common Issues

*   **Error: `TypeError: require(...).index is not a constructor`**
    *   *Cause*: This occurs when a native library (like `brotli-wasm`) from LangChain gets bundled in the node's subdirectory, triggering an n8n VM isolation sandbox crash.
    *   *Solution*: The automated installer uses `--omit=peer` to prevent this. If you are updating from an older version, run the cleanup command first:
        ```bash
        rm -rf ~/.n8n/custom/node_modules/n8n-nodes-extra-ai-providers
        ./install.sh
        ```
*   **Custom Nodes do not show up in the n8n UI**
    *   *Cause 1*: n8n was not restarted after running `./install.sh`.
    *   *Cause 2*: n8n is running under a different OS user who cannot access `/home/<your-user>/.n8n/custom`. Ensure the running user has read/write permissions.
    *   *Cause 3*: n8n is not loading the custom extension directory. Set the environment variable `N8N_CUSTOM_EXTENSIONS` to your custom node folder absolute path (e.g. `N8N_CUSTOM_EXTENSIONS=/home/dxtz/.n8n/custom`).
*   **Checking Startup Logs**
    *   Check your n8n console/process output to verify it successfully scanned the directory.
    *   **PM2 logs command**: `pm2 logs n8n`
    *   **Systemd logs command**: `journalctl -u n8n -n 100 --no-pager`

## 👨‍💻 Development

1. Clone the repo.
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. For development mode: `npm run dev`

---
Built with ❤️ by [DutaKey](https://github.com/DutaKey)
