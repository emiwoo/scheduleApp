import { Pool } from 'pg';
const pool = new Pool({
    user: 'p',
    host: 'localhost',
    database: 'scheduleapp_database',
    password: '',
    port: 5432
});
export default pool;
//# sourceMappingURL=db.js.map