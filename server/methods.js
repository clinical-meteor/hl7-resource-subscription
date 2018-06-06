import { EJSON } from 'meteor/ejson'

Meteor.methods({
    createSubscription(resourceType, query, options){
      console.log('Creating ' + resourceType + ' subscriptions...')

      check(resourceType, String)
      check(query, Object)
      check(options, Object)

      var newSubscription = {
        "meta": {
            "versionId": 1,
            "lastUpdated": new Date()
        },
        "resourceType": "Subscription", 
        "status": "active",
        "criteria": EJSON.stringify(query),
        "channel": {
          "type": "websocket",
          "endpoint": Meteor.absoluteUrl(),
          "payload": resourceType,
          "query": query,
          "options": EJSON.stringify(options),
          "triggers": {
              "after": {
                "find": {},
                "findOne": {},
                "insert": {},
                "update": {},
                "delete": {}
              },
              "before": {
                "find": {},
                "findOne": {},
                "insert": {},
                "update": {},
                "delete": {}
              }
            }
        }
      };

      process.env.VERBOSE && console.log('newSubscription', newSubscription)

      let currentSubscription = Subscriptions.findOne({'channel.payload': resourceType});

      
      if(currentSubscription){
        process.env.DEBUG &&console.log('Subscription exists; updating...')
        Subscriptions.update({_id: currentSubscription._id}, { $set: newSubscription });       
      } else {
        process.env.DEBUG &&console.log('Creating...')
        Subscriptions.insert(newSubscription);       
      }
    },
    removeSubscription(resourceType){
        console.log('Removing ' + resourceType + ' subscriptions...')

        check(resourceType, String)

        Subscriptions.remove({'channel.payload': resourceType});
    }
})