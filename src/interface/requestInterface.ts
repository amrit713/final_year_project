import {
    Request,RequestHandler
} from "express"

export interface IGetUserAuthInfoRequest extends Request {
    user: RequestHandler | any;
}