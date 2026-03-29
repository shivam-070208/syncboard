import bcrypt from "bcrypt"

class Hash {
  private readonly saltRounds = 10

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}

export default new Hash()
