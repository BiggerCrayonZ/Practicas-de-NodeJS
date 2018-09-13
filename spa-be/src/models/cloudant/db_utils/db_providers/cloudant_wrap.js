/** Class representing the basic CRUD operations for cloudant */
class Cloudant_Wrap {

  /**
   *
   * @param {object} credentials Database credentials
   * @param {object} options Defined as {name: Database_name,
   *  model: object_model,
   *  indexes: array_of_indexes
   * }
   */
  constructor(credentials, options) {
    let Cloudant = require('cloudant');
    if (options === undefined) {
      throw 'No options object specified'
    } else if (typeof options.name !== 'string') {
      throw 'No database specified'
    }

    if (typeof options.model === 'object') {
      this.base_model = options.model;
    }
    this.db_name = options.name;
    this.cloudant = Cloudant(credentials);
    this.database = this.cloudant.db.use(this.db_name);
  }

  /**
   * Get an object from database based on id,
   * if no id is present lists all objects
   * @param {string} id - The id of the object to get
   *
   */
  read(id) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.database.get(id, (err, data) => {
          if (data) {
            resolve(data);
          } else {
            reject(204);
          }
        });
      } else {
        this.database.list({
          include_docs: true
        }, (err, data) => {
          if (data) {
            var result = [];
            data.rows.forEach((row) => {
              if (row.id.substr(0, 8) !== '_design/') {
                result.push(row.doc);
              }
            });
            resolve(result);
          } else {
            reject(204);
          }
        });
      }
    });
  }

  /**
   * Creates a new object and assigns default values based on base_model
   * @param {object} new_object - Object to save in database
   */
  create(new_object) {
    return new Promise((resolve, reject) => {
      if (new_object != undefined) {
        if (new_object._rev != undefined) {
          delete new_object._rev;
        }
        if (this.base_model){
          var model = JSON.parse(JSON.stringify(this.base_model));
          Object.keys(new_object).forEach((key) => {
            if (model[key] !== undefined) {
              model[key] = new_object[key];
            }
          });
        } else {
          model = new_object;
        }
        this.database.insert(model, (err, data) => {
          if (data) {
            model._id = data.id;
            resolve(model);
          } else {
            reject(err);
          }
        });
      } else {
        reject(400);
      }
    });
  }

  /**
   * Update the values of an object.
   * Change only the values present in the new_object and keeps
   * all other values unchanged.
   * @param {object} new_object - The object to update in database
   */
  update(new_object) {
    return new Promise((resolve, reject) => {
      if (new_object != undefined && new_object._id != undefined) {
        if (new_object._rev != undefined) {
          delete new_object._rev;
        }
        this.database.get(new_object._id, (err, old_object) => {
          if (old_object) {
            Object.keys(new_object).forEach((key) => {
              if (old_object[key] !== undefined) {
                old_object[key] = new_object[key];
              }
            });
            this.database.insert(old_object, (err, response) => {
              if (response) {
                old_object._rev = response.rev;
                resolve(old_object);
              } else {
                reject(500);
              }
            });
          } else {
            reject(204);
          }
        });
      } else {
        reject(400);
      }
    });
  }

  /**
   * Delete an object from database based on the ID
   * @param {string} id - ID of object to delete
   */
  delete(id) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.database.get(id, (err, data) => {
          if (data) {
            this.database.destroy(data._id, data._rev, (err, data) => {
              if (data) {
                resolve(data);
              } else {
                reject(500);
              }
            });
          } else {
            reject(204);
          }
        })
      } else {
        reject(400);
      }
    });
  }

  /**
   * Query the cloudant database
   * @param {object} query - Cloudant query as an object
   */
  query(query) {
    return new Promise((resolve, reject) => {
      this.database.find(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.docs);
        }
      });
    });
  }

  /**
   * Insert indexes in the database.
   * To be used on a clean database
   * @param indexes Array of cloudant indexes
   */
   insertIndexes(indexes) {
      return new Promise((resolve, reject) => {
        var promises = [];
        if (!indexes) {
          resolve(204);
        } else {
          Object.keys(indexes).forEach((key) => {
            promises.push(new Promise((resolve, reject) => {
              this.database.index(indexes[key], (err, response) => {
                if (err) {
                  reject([]);
                } else {
                  resolve(response);
                }
              });
            }));
          });
          Promise.all(promises).then(values => {
            resolve(values);
          });
        }
      });
    }

  /**
   * Insert an array of elements
   * @param {string} docs Array of objects to be created on the DB
   * @param {function} process_documents Function to be ejecuted on docs
   */
  bulk(docs, process_documents) {
    return new Promise((fulfill, reject) =>{
      if (!docs || !docs[0]) {
        reject(400)
      } else {

        if(typeof process_documents === 'function'){
          docs.forEach(process_documents);
        }

        this.database.bulk({
          docs: docs
        }, function(err, data) {
          if (err) {
            reject(err);
          } else {
            fulfill(data);
          }
        })
      }
    });
  }

  /**
   * Create a new database
   * @param {string} db_name Name of new database to be created
   */
  createDB(db_name) {
    return new Promise((resolve, reject) => {
      this.cloudant.db.create(db_name, err => {
        if (err) {
          reject(err);
        } else {
          this.database = this.cloudant.db.use(db_name);
          resolve(200);
        }
      });
    });
  }

  /**
   * Remove a database by name
   * @param {string} db_name Name of database to delete
   */
  
  deleteDB(db_name) {
    return new Promise((resolve, reject) => {
      this.cloudant.db.destroy(db_name, err => {
        if (err) {
          reject(err);
        } else {
          resolve(200);
        }
      });
    });
  }

}

exports.Cloudant_Wrap = Cloudant_Wrap;
