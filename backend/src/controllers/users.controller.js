const { signupService } = require('../services/auth.services');
const validateInput = require('../utils/validate_user_input');
const { SUCCESS_MESSAGES } = require('../utils/constants');

//Login to 
exports.addUser = async (req, res) => {
    try {
        const errors = validateInput(req.body, ['email', 'password', 'phoneNumber', 'role']); 
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const { first_name, last_name, email, password, phoneNumber, role } = req.body;
        const user = await signupService({ first_name, last_name, email, password, phoneNumber, role });
        res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED,data:user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};