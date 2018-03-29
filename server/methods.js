

Meteor.methods({
    initializeSubscriptions(){
      console.log('Initialize Subscriptions...')

      var newSubscription = {
          "resourceType": "Subscription",
        
        };


        if(Subscriptions.find().count() < 2){

          newSubscription = {};

          var consentId = Subscriptions.insert(newSubscription);

            console.log('Initialized ' + Subscriptions.find().count() + ' records.')          
        }
    }
})