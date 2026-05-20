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
- *(More coming soon...)*

## 🛠 Installation

### For Self-hosted n8n (Docker)

1. Mount the `dist` folder of this package to your n8n custom nodes directory:
   ```yaml
   volumes:
     - /path/to/n8n-nodes-extra-ai-providers/dist:/data/custom
   ```
2. Set the environment variable:
   ```yaml
   environment:
     - N8N_CUSTOM_EXTENSIONS=/data/custom
   ```

## 👨‍💻 Development

1. Clone the repo.
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. For development mode: `npm run dev`

---
Built with ❤️ by [DutaKey](https://github.com/DutaKey)
