import { Request, Response } from 'express';
import * as authService from '../services/authService';
import  db  from '../config/db.config'


export const registerUser =  async ( req: Request, res: Response ) => {
    const { userName, password, profileImg } = req.body;
    try {
        await authService.registerUser( db, userName, password, profileImg);
        return res.status(201).json({ success: true });
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
};

export const loginUser = ( req: Request, res: Response ) => {
    const {  } = req.body;
    return
}

export const refresh = ( req: Request, res: Response ) => {
    return 
}