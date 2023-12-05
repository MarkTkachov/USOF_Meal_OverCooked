import bcrypt from 'bcrypt';
// eslint-disable-next-line no-undef
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

function hashPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}


export {hashPassword, comparePassword};
