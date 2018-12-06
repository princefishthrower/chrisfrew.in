const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.CHRISFREW_IN_DB_USER,
  host: process.env.CHRISFREW_IN_DB_HOST,
  database: process.env.CHRISFREW_IN_DB,
  password: process.env.CHRISFREW_IN_DB_PASSWORD,
  port: process.env.CHRISFREW_IN_DB_PORT
});


  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object 
   */
function query(text, params){
  return new Promise((resolve, reject) => {
    pool.query(text, params)
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    })
  })
}

exports.query = query;