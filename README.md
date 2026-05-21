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

## 🛠 Installation

Choose the installation method that matches your n8n setup:

### 1. Docker-Compose (Recommended for standard Docker setups)

Mount the built `dist` folder of this package to your n8n custom nodes directory and configure the environment variable:

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    # ... other config
    environment:
      - N8N_CUSTOM_EXTENSIONS=/data/custom
    volumes:
      - /path/to/n8n-nodes-extra-ai-providers/dist:/data/custom
```

### 2. NPM-based n8n (Local / VM / Global installation)

If you installed n8n via NPM (e.g. `npm install -g n8n`), you can automatically link this built package to your local n8n custom nodes folder:

1. Clone this repository and compile the project:
   ```bash
   npm install
   npm run build
   ```
2. Run the helper installation script:
   ```bash
   npm run link-local
   ```
   *This automatically registers the package inside your `~/.n8n/custom/` folder and installs all necessary dependencies.*
3. (Re)start your n8n instance:
   ```bash
   n8n start
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

## 👨‍💻 Development

1. Clone the repo.
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. For development mode: `npm run dev`

---
Built with ❤️ by [DutaKey](https://github.com/DutaKey)
