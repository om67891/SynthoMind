const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

const isNotAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/home');
    } else {
        next();
    }
};

module.exports = { isAuthenticated, isNotAuthenticated };