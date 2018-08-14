/**
 * GroupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  create: async function (req, res) {

    Log('Attempting to create a new Group for : ' + req.body.userId);

    var findCriteria = {
      groupId: req.body.groupId,
      groupName: req.body.groupName
    };
    var recordToCreate = {
      groupId: req.body.groupId,
      groupName: req.body.groupName
    };

    Group.findOne(findCriteria).exec(function (err, group) {
      if (err) return res.serverError(err);

      if (user) {
        const msg = 'Existing Group found with groupId: ' + group.groupId + ' groupName: ' + group.groupName;
        Log(msg);
        return res.json(msg);
      } else {
        Group.create(recordToCreate, async function (err, newGroup) {
          if (err) return res.serverError(err);
          Log('A new group created with groupId: ' + newGroup.groupId + ' groupName: ' + newGroup.groupName);
          // Find the user since newGroup on callback is undefined
          newGroup = await UserGroup.findOne({
            groupId: recordToCreate.groupId,
            groupName: recordToCreate.groupName
          });
          return res.json(newGroup);
        });
      }
    });
  },
};
        