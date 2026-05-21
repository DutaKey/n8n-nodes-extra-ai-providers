const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('🚀 Setting up n8n-nodes-extra-ai-providers for local NPM installation...');

// 1. Resolve source and target paths
const packageRoot = path.resolve(__dirname, '..');
const customNodesDir = path.resolve(os.homedir(), '.n8n', 'custom');

console.log(`- Package source: ${packageRoot}`);
console.log(`- Target directory: ${customNodesDir}`);

// 2. Ensure target directory exists
if (!fs.existsSync(customNodesDir)) {
	console.log(`- Creating directory: ${customNodesDir}...`);
	fs.mkdirSync(customNodesDir, { recursive: true });
}

// 3. Ensure target package.json exists to prevent NPM from installing in a parent directory
const targetPackageJson = path.join(customNodesDir, 'package.json');
if (!fs.existsSync(targetPackageJson)) {
	console.log('- Initializing target package.json...');
	const initialJson = {
		name: 'n8n-custom-nodes',
		version: '1.0.0',
		private: true,
		description: 'Local custom nodes directory for n8n',
	};
	fs.writeFileSync(targetPackageJson, JSON.stringify(initialJson, null, 2), 'utf-8');
}

// 4. Install the package locally
console.log(`- Installing package to custom nodes directory...`);
try {
	const targetPackageDir = path.join(customNodesDir, 'node_modules', 'n8n-nodes-extra-ai-providers');
	if (fs.existsSync(targetPackageDir)) {
		console.log(`- Cleaning up existing installation at ${targetPackageDir}...`);
		fs.rmSync(targetPackageDir, { recursive: true, force: true });
	}

	console.log(`- Installing package using --omit=peer...`);
	execSync(`npm install --omit=peer "${packageRoot}"`, {
		cwd: customNodesDir,
		stdio: 'inherit',
	});

	console.log('\n✅ Successfully installed and linked custom nodes package!');
	console.log('\n💡 To run n8n with these nodes:');
	console.log('  1. Ensure you have run "npm run build" in the package directory to build the TypeScript files.');
	console.log('  2. (Re)start your local n8n instance (e.g., run: n8n start).');
} catch (error) {
	console.error('\n❌ Failed to install package in the custom nodes directory:', error.message);
	process.exit(1);
}
