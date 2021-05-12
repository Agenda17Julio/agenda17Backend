
const { UserMail, PasswordMail, HostMail  } = process.env;

export const transportConfig = {
    host: HostMail,
    port: 465,
    secure: true,
    auth: {
      user: UserMail, 
      pass: PasswordMail
    }
}