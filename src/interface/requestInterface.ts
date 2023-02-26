import {
    Request,RequestHandler
} from "express"
// import { IModelUser } from "../model/userModel";

export interface IGetUserAuthInfoRequest extends Request {
    user: RequestHandler | any;
}