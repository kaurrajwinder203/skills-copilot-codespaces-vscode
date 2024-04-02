// Create web server
// 1. Create a web server
// 2. Read the html file
// 3. Send the html file to the client
// 4. Create a form to submit comments
// 5. Save the comments in a file
// 6. Read the comments from the file
// 7. Display the comments on the page

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const commentsFile = path.join(__dirname, 'comments.json');

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal server error');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }

    if (req.url === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const comments = JSON.parse(fs.readFileSync(commentsFile));
            comments.push(JSON.parse(body));
            fs.writeFileSync(commentsFile, JSON.stringify(comments));
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Comment added'}));
        });
    }

    if (req.url === '/comments' && req.method === 'GET') {
        const comments = JSON.parse(fs.readFileSync(commentsFile));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(comments));
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
