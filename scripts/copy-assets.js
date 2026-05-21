const fs = require('fs');
const path = require('path');

console.log('📦 Running copy-assets script...');

const srcDirs = ['nodes', 'credentials'];
const destDir = 'dist';
const allowedExtensions = ['.svg', '.json', '.png', '.jpg', '.jpeg', '.gif'];

function copyFiles(src, dest) {
	const stats = fs.statSync(src);
	if (stats.isDirectory()) {
		fs.readdirSync(src).forEach(child => {
			copyFiles(path.join(src, child), path.join(dest, child));
		});
	} else {
		const ext = path.extname(src).toLowerCase();
		if (allowedExtensions.includes(ext)) {
			const dir = path.dirname(dest);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			fs.copyFileSync(src, dest);
			console.log(`  - Copied: ${path.relative(path.resolve(__dirname, '..'), src)} -> ${path.relative(path.resolve(__dirname, '..'), dest)}`);
		}
	}
}

srcDirs.forEach(dir => {
	const srcPath = path.resolve(__dirname, '..', dir);
	const destPath = path.resolve(__dirname, '..', destDir, dir);
	if (fs.existsSync(srcPath)) {
		copyFiles(srcPath, destPath);
	}
});

console.log('✅ Asset copying completed successfully.');
