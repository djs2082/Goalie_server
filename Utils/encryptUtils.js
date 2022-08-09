const bcrypt = require('bcryptjs');

exports.ecryptHash =  async (saltLength, value) => {
    const salt = await bcrypt.genSalt(saltLength);
    return hashedPassword = await bcrypt.hash(value,salt);
}