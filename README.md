##  clinical:hl7-resource-subscription   


#### Licensing  
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)


#### Integration & Verification Tests  
[![CircleCI](https://circleci.com/gh/clinical-meteor/hl7-resource-risk-assessment/tree/master.svg?style=svg)](https://circleci.com/gh/clinical-meteor/hl7-resource-risk-assessment/tree/master)


#### API Reference  
The resource in this package implements Practitioner resource schema, specified at [https://www.hl7.org/fhir/riskassessment.html](https://www.hl7.org/fhir/riskassessment.html). 


#### Installation  

```bash
meteor add clinical:hl7-resource-subscription
```

You may also wish to install the `autopublish` package, which will set up a default publication/subscription of the Subscriptions collection for logged in users.  You will need to remove the package before going into production, however.

```bash
meteor add clinical:autopublish  
```


#### Example    

```js
var newSubscription = {

};
Subscriptions.insert(newSubscription);
```


#### Extending the Schema  

If you have extra fields that you would like to attach to the schema, extend the schema like so:  

```js
ExtendedSubscriptionSchema = new SimpleSchema([
  SubscriptionSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Subscriptions.attachSchema( ExtendedSubscriptionSchema );
```


#### Initialize a Sample Subscription  

Call the `initializeSubscription` method to create a sample subscription in the Subscriptions collection.

```js
Meteor.startup(function(){
  Meteor.call('initializeSubscription');
})
```


#### Server Methods  

This package supports `createSubscription`, `initializeSubscription`, and `dropSubscription` methods.


#### REST API Points    

This package supports the following REST API endpoints.  All endpoints require an OAuth token.  

```
GET    /fhir-1.6.0/Subscription/:id    
GET    /fhir-1.6.0/Subscription/:id/_history  
PUT    /fhir-1.6.0/Subscription/:id  
GET    /fhir-1.6.0/Subscription  
POST   /fhir-1.6.0/Subscription/:param  
POST   /fhir-1.6.0/Subscription  
DELETE /fhir-1.6.0/Subscription/:id
```

If you would like to test the REST API without the OAuth infrastructure, launch the app with the `NOAUTH` environment variable, or set `Meteor.settings.private.disableOauth` to true in you settings file.

```bash
NOAUTH=true meteor
```

