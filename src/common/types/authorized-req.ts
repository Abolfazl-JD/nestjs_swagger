import { Request } from "express";
import { User } from "src/users/user.entity";

export interface AuthorizedReq extends Request {
    user: User
}