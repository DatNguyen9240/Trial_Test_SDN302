const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/view/auth/login');
};

module.exports = {
    isAuthenticated
}; 