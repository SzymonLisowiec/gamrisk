export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: +process.env.DB_PORT || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    typeCast: function(field, next) {
      if (field.type == 'TINY' && field.length === 1 && field.name.startsWith('is')) {
        return field.string() === '1';
      } 
      return next();
    },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migration',
    extension: 'ts',
  },
};
