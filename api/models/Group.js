/**
 * Group.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    groupId: {
      type: 'string',
      required: true,
      unique: true,
    },
    groupName: {
      type: 'string',
      required: true
    },
    
    // Add a reference to UserGroup
    owner: {
      model: 'usergroup'
    }  
  },

};

