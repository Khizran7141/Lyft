import { IUser } from "src/models/Users";


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
