export class UserAccount {
  username: string;
  system: string;
  roles: string[];
  
  constructor(data: any) {
    if (data) {
      this.username = data.username;
      this.system = data.system;
      this.roles = data.roles;
    }
  }

  hasRole(role: string) {
    return this.roles.includes(role);
  }
}