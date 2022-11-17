class UserAccount {
  constructor(data) {
    if (data) {
      this.username = data.username;
      this.system = data.system;
      this.roles = data.roles;
    }
  }

  hasRole(role) {
    return this.roles.includes(role);
  }
}

module.exports = UserAccount;