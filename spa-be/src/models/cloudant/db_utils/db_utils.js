let {Cloudant_Wrap} = require('./db_providers/cloudant_wrap.js')


/** */
class DB_Utils {
  /**
   *
   * @param {object} credentials Database credentials
   * @param {string} type Type of database wrapper
   * @param {object} options To be passed to the wrapper
   */
  constructor(credentials, type, options) {
    this.credentials = credentials
    this.options = options
    this.setDBType(type);
  }

  /**
   * Instance the database wraper and returns a crud
   */
  get CRUD(){
    return new this.dbClass(this.credentials, this.options);
  }

  /**
   *
   * @param {string} type Type of database wrapper can be one of [cloudant, db2]
   */
  setDBType(type){
    switch (type) {
      case 'cloudant':
        this.dbClass = Cloudant_Wrap;
        break;
      case 'db2':
        this.dbClass = DB2_Wrap;
        break;
    }
  }
}

exports.DB_Utils = DB_Utils;