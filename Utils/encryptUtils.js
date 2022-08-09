const bcrypt = require('bcryptjs');

exports.ecryptHash =  async (saltLength, value) => {
    const salt = await bcrypt.genSalt(saltLength);
    return hashedPassword = await bcrypt.hash(value,salt);
}

exports.comparePassword = async (bodyPassword, dbPassword) => {
    return await bcrypt.compare(bodyPassword, dbPassword);
}
