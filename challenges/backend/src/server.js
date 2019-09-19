'use strict'

const Hapi = require('@hapi/hapi');
const fs = require('fs');

const initServer = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path: '/data',
        handler: (request, h) => {

            // capture list from request body.
            let list = request.payload.list;

            // tries to parse a json object.
            try {
                list = JSON.parse(list);
            } catch (err) {
                return h.response('invalid json object').code(400);
            }

            //if the list isn't really a json array or the list isn't up to 500, throw err.
            if (!Array.isArray(list) || list.length !== 500) {
                return h.response('invalid array object').code(400);
            }

            list.sort();
            // write to file
            try {
                fs.writeFileSync('savedlist.txt', JSON.stringify(list), err => {
                    if (err) throw err;
                })
            } catch (err) {
                console.log(err);
                return h.response('could not save list').code(400);
            }

            //return success
            return h.response('list created');
        }
    });

    server.route({
        method: 'GET',
        path: '/data',
        handler: (request, h) => {''
            let buffer = fs.readFileSync('savedlist.txt', 'utf8', (err, data) => {
                if (err) throw "could not retrieve file";
                return data
            });
            return h.response(JSON.stringify(buffer));
        }
    });

    server.route({
        method: 'PATCH',
        path: '/data',
        handler: (request, h) => {
            let number = JSON.parse(request.payload.number);
            if(isNaN(number) && isFinite(number)) {
                return h.code(400);
            }
            let buffer = fs.readFileSync('savedlist.txt', 'utf8', (err, data) => {
                if (err) throw "could not retrieve file";
                return data
            });
            let list = JSON.parse(buffer);
            list.push(number)

            // we could avoid the sorting overhead and use some binary search insertion
            // which are worst occurs O(n) overhead.
            list.sort();
            fs.writeFileSync('savedlist.txt', JSON.stringify(list), err => {
                if (err) throw err;
            })
            return `patched number ${number}`;
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

initServer();