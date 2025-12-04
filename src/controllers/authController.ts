import { Request, Response } from 'express';
import * as authService from '../services/authService';
import  db  from '../config/db.config'


export const registerUser =  async ( req: Request, res: Response ) => {
    const { userName, password, profileImg } = req.body;
    try {
        await authService.registerUser( db, userName, password, profileImg);
        return res.status(201).json({ success: true });
    } catch (err) {
        return res.status(400).json({ 
            success: false, 
            error: err instanceof Error ? err.message : String(err) 
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { userName, password } = req.body;
    try {
        const response = await authService.loginUser(db, userName, password);
        return res.status(200).json({ 
            success: true, 
            token: response.token,
            userId: response.user.userId,
            userName: response.user.userName 
        });
    } catch (err) {
        return res.status(400).json({ 
            success: false, 
            error: err instanceof Error ? err.message : String(err) 
        });
    }
};


export const refresh = ( req: Request, res: Response ) => {
    return 
}