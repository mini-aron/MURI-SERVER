import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '1h'

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET 환경변수가 없습니다');
}

export const generateAccessToken = ({ id, name }: { id: string, name: string }) => {
    const payload = {
        sub: id,
        userName: name,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const registerUser = async (knex: Knex, userName: string, password: string, profileImg?: string) => {
    console.log(`[registerUser] 시작: userName=${userName} password=${password}`);
    const duplicate = await knex('user').where({ userName }).count('userId as count');
    console.log(`[registerUser] 중복 검사 결과: ${duplicate[0].count}`);
    if (Number(duplicate[0].count) > 0) {
        console.error(`[registerUser] 실패: 이미 존재하는 사용자명`);
        throw new Error('이미 존재하는 사용자명입니다.');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userId = crypto.randomUUID();

    await knex('user').insert({
        userId,
        userName,
        password: hashedPassword,
        profileImg: profileImg || null
    });
    console.log(`[registerUser] 성공: userId=${userId}`);
    return { success: true };
};


export const loginUser = async (knex: Knex, userName: string, password: string) => {
    console.log(`[loginUser] 시작: userName=${userName}`);
    const user = await knex('user').first('*').where({ userName });
    if (!user) {
        console.error(`[loginUser] 실패: 잘못된 사용자명`);
        throw new Error('잘못된 사용자명입니다.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.error(`[loginUser] 실패: 잘못된 비밀번호`);
        throw new Error('잘못된 비밀번호입니다.');
    }
    const token = generateAccessToken({ id: user.userId, name: user.userName });
    console.log(`[loginUser] 성공: userId=${user.userId}`);
    return { token, user };
};
