const { signupService,loginService } = require('../services/auth.services');
const { SUCCESS_MESSAGES } = require('../utils/constants');
const validateInput = require('../utils/validate_user_input');

// Signup API
exports.signup = async (req, res) => {
    try {
        // console.log("Inside backend code");
        const errors = validateInput(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const { first_name, last_name, email, password, phoneNumber, role } = req.body;
        await signupService({ first_name, last_name, email, password, phoneNumber, role });

        res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, role } = await loginService({ email, password });

        res.status(200).json({ token, role, message: SUCCESS_MESSAGES.LOGIN_SUCCESS });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

