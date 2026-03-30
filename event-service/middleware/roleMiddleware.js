const roleMiddleware = (allowedRoles) => {

    return (req, res, next) => {

        // Convert single role to array
        if (!Array.isArray(allowedRoles)) {
            allowedRoles = [allowedRoles];
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        next();
    };
};

module.exports = roleMiddleware;