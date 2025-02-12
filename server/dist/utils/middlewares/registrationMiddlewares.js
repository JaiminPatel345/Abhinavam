export const validateRegistrationInput = (req, res, next) => {
    const { email, password, mobile } = req.body;
    if (!email || !password || !mobile) {
        res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
        return;
    }
    // Add more validation rules
    next();
};
//# sourceMappingURL=registrationMiddlewares.js.map