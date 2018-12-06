const { Pool } = require('pg');
// create a pool for postgres

const pool = new Pool({
  connectionString: process.env.CHRISFREW_IN_DATABASE_URL
})

export default {
  /**
  * DB Query
  * @param {object} req
  * @param {object} res
  * @returns {object} object
  */
  query(text, params) {
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
}