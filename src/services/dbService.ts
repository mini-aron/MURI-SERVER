import { Knex } from "knex";

export async function executeQuery<T>(queryFn: () => Promise<T>): Promise<T> {
    try {
        // DB 연결 상태 체크(필요시)
        // 예: await knex.raw('SELECT 1') or connection pool check

        const result = await queryFn(); // 실제 쿼리 함수 실행
        console.log("Query data:",result)
        return result;
    } catch (error) {
        console.error('DB query error:', error);
        // 원하는 커스텀 에러 처리 또는 재시도 로직도 이곳에서
        throw error;
    }
}

