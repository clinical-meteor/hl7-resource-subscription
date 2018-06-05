

Meteor.methods({
    createSubscription(resourceType, query, options){
      console.log('Create Subscriptions...')

      var newSubscription = {
        "resourceType": "Subscription", 
        "status": "active",
        "channel": {
          "type": "websocket",
          "endpoint": "http://localhost:3000",
          "payload": {
            "resourceType": resourceType,
            "query": query,
            "options": options,
            "trigger": {
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
        }
      };


      Subscriptions.insert(newSubscription);       
    }
})