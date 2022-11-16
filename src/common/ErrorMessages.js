const userNotFound = () => {
  throw new Error('A user account could not be found for this user');
}

const tenantNotFound = () => {
  throw new Error('A tenant could not be found for this user');
}

module.exports = {
  userNotFound,
  tenantNotFound
};