const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4322;
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, 'frontend', 'dist');

const MIME_TYPES = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.json': 'application/json',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
	if (req.method !== 'GET' && req.method !== 'HEAD') {
		res.statusCode = 405;
		res.end('Method Not Allowed');
		return;
	}

	let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

	if (!filePath.startsWith(PUBLIC_DIR)) {
		res.statusCode = 403;
		res.end('Forbidden');
		return;
	}

	fs.stat(filePath, (err, stats) => {
		if (err || !stats.isFile()) {
			const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
			fs.readFile(fallbackPath, (fallbackErr, content) => {
				if (fallbackErr) {
					res.statusCode = 404;
					res.end('Not Found');
				} else {
					res.writeHead(200, { 'Content-Type': 'text/html' });
					res.end(content);
				}
			});
			return;
		}

		const ext = path.extname(filePath).toLowerCase();
		const contentType = MIME_TYPES[ext] || 'application/octet-stream';

		res.writeHead(200, {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000'
		});

		const stream = fs.createReadStream(filePath);
		stream.pipe(res);
	});
});

server.listen(PORT, HOST, () => {
	console.log(`Server running at http://${HOST}:${PORT}/`);
});
