const fastify = require('fastify')({ logger: true });

fastify.register(require('fastify-multipart'), {
    attachFieldsToBody: true,
});

fastify.register(require('fastify-cookie'), {
    secret: "my-secret",
    parseOptions: {}
});

const usersRoute = '/users';
let id = 1;
const users = {};
const authToken = 'safsdfsaafasd53dfdsa';

fastify.register((instance, { }, next) => {
    instance.addHook('onRequest', (request, replay, done) => {
        const { auth } = request.cookies;

        if (auth === authToken) {
            done();
        } else {
            replay.status(403).send({ error: "Access denied" })
        }
    });



    instance.get('/users', (request, reply) => {
        reply.status(200).send(users);
    });




    const validation = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    age: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'number',
                                minimum: 18,
                                maximum: 60
                            }
                        }
                    },
                    lastName: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 20
                            }
                        }
                    },
                    firstName: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 20
                            }
                        }
                    }
                }
            }
        }
    };

    instance.post(usersRoute, validation, (request, reply) => {
        const user = {
            firstName: request.body.firstName.value,
            lastName: request.body.lastName.value,
            age: request.body.age.value,
            id,
        };
        users[id] = user;
        id += 1;

        reply.send(users);
    });

    instance.delete('/users', (request, reply) => {
        const id = request.body.id.value;
        delete users[id];

        reply.send(users);
    });

    instance.delete('/users/:id', (request, replay) => {
        const { id } = request.params;
        delete users[id];

        replay.send(users);
    });

    instance.put('/users/:id', validation, (request, replay) => {

        const { id } = request.params;

        const user = {
            firstName: request.body.firstName.value,
            lastName: request.body.lastName.value,
            age: request.body.age.value,
            id,
        };

        users[id] = user;
        replay.send(users);
    });
    next()
});



fastify.post('/login', (request, replay) => {
    const username = request.body.username.value
    const password = request.body.password.value

    if (username === 'Radik' && password === 'admin') {
        replay.setCookie('auth', authToken, {
            httpOnly: true,
        }).send('ok');
    } else {
        replay.status(403).send('username or password is not correct')
    }
});

fastify.get('/check', (request, replay, done) => {

    replay.setCookie('auth', 'safsdfsaafasd53dfdsa', {
        httpOnly: true,
    }).send('')
});

fastify.delete('/logout', (request, replay) => {
replay.clearCookie('auth').send('logout')
});

const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start();