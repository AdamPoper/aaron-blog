import basicAuth from 'express-basic-auth';

const authMiddleware = basicAuth({
    users: {
        'apoper': process.env.BLOG_PASSWORD!
    }, challenge: true
});

export default authMiddleware;
