// validate the token for every API call, except login end registration because those are the non-protected routes (public roads)

const jwt = require('jsonwebtoken');

//request, response, next 	//index 0 is Bearer keyword, index 1 is token

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
		next();
	} catch (error) {
		res.send({
			message: error.message,
			success: false,
		});
	}
};
