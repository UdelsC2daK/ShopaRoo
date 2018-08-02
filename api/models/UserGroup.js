/**
 * UserGroup.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    userId: {
      type: 'string',
      required: true,
      unique: true,
    },
    groupId: {
      type: 'string',
      required: true,
      unique: true,
    },
    // Add a reference to User
    owner: {
      model: 'user'
    },
 

  },

};
