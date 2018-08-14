/**
 * Group.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    userGroupId: {
      type: 'string',
      unique: true,
    },
    userId: {
      type: 'string',
      required: true
    },
    groupId: {
      type: 'string',
      required: true,
    },
    groupName: {
      type: 'string',
      required: true
    },

    // Add a reference to UserGroup
    owner: {
      model: 'user'
    }
  },
  
  beforeCreate: function (group, next) {
    group.userGroupId = group.userId + group.groupId;
    next();
  },

  /**
   * this holds our validation message by
   * sails-hook-validation dependency
   */
  validationMessages: {
    groupName: {
      required: 'Group name is required'
    },
    groupId: {
      required: 'Group Id is required'
    }
  },


};
