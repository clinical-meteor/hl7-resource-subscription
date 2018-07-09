// https://www.hl7.org/fhir/subscription.html


import { BaseModel } from 'meteor/clinical:base-model';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { BaseSchema, DomainResourceSchema } from 'meteor/clinical:hl7-resource-datatypes';


// create the object using our BaseModel
Subscription = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Subscription.prototype._collection = Subscriptions;


// Create a persistent data store for addresses to be stored.
// HL7.Resources.Subscriptions = new Mongo.Collection('HL7.Resources.Subscriptions');

if(typeof Subscriptions === 'undefined'){
  if(Package['clinical:autopublish']){
    Subscriptions = new Mongo.Collection('Subscriptions');
  } else {
    Subscriptions = new Mongo.Collection('Subscriptions', {connection: null});
  }
}


//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Subscriptions._transform = function (document) {
  return new Subscription(document);
};



SubscriptionSchema = new SimpleSchema([
  BaseSchema,
  DomainResourceSchema,
  {
  "resourceType" : {
    type: String,
    defaultValue: "Subscription"
  },
  "status" : {
    optional: true,
    type: Code
  }, 
  "contact" : {
    optional: true,
    type: [ ContactPointSchema ]    
  }, 
  "end" : {
    optional: true,
    type: Date
  },
  "reason" : {
    optional: true,
    type: String
  },
  "criteria": {
    optional: true,
    type: String
  },
  "channel.type": {
    optional: false,
    type: String,
    allowedValues: ["rest-hook", "websocket", "email", "sms", "message"],
    defaultValue: "websocket"
  },
  "channel.endpoint": {
    optional: true,
    type: String
  },
  "channel.payload": {
    optional: true,
    type: String
  },
  "channel.header": {
    optional: true,
    type: [ String ] 
  },
  "channel.resourceType": {
    optional: true,
    type: String 
  },
  "channel.query": {
    optional: true,
    blackbox: true,
    type: Object 
  },
  "channel.options": {
    optional: true,
    blackbox: true,
    type: String
  },
  "channel.triggers": {
    optional: true,
    blackbox: true,
    type: Object 
  },
  "tag": {
    optional: true,
    type: [ String ]
  }
}]);
Subscriptions.attachSchema(SubscriptionSchema);


Subscription.prototype.toFhir = function(){
  console.log('Subscription.toFhir()');
  return EJSON.stringify(this.name);
}



/**
 * @summary Search the Subscriptions collection for a specific Meteor.userId().
 * @memberOf Subscriptions
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let subscriptions = Subscriptions.findMrn('12345').fetch();
 * ```
 */

Subscriptions.fetchBundle = function (query, parameters, callback) {
  process.env.TRACE && console.log("Subscriptions.fetchBundle()");  
  var subscriptionArray = Subscriptions.find(query, parameters, callback).map(function(subscription){
    subscription.id = subscription._id;
    delete subscription._document;
    return subscription;
  });

  // console.log("subscriptionArray", subscriptionArray);

  var result = Bundle.generate(subscriptionArray);

  // console.log("result", result.entry[0]);

  return result;
};


/**
 * @summary This function takes a FHIR resource and prepares it for storage in Mongo.
 * @memberOf Subscriptions
 * @name toMongo
 * @version 1.6.0
 * @returns { Subscription }
 * @example
 * ```js
 *  let subscriptions = Subscriptions.toMongo('12345').fetch();
 * ```
 */

Subscriptions.toMongo = function (originalSubscription) {
  var mongoRecord;
  process.env.TRACE && console.log("Subscriptions.toMongo()");  

  if (originalSubscription.identifier) {
    originalSubscription.identifier.forEach(function(identifier){
      if (identifier.period) {
        if (identifier.period.start) {
          var startArray = identifier.period.start.split('-');
          identifier.period.start = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
        if (identifier.period.end) {
          var endArray = identifier.period.end.split('-');
          identifier.period.end = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
      }
    });
  }

  return originalSubscription;
};



/**
 * @summary This function takes a DTSU2 resource and returns it as STU3.  i.e. it converts from v1.0.2 to v3.0.0
 * @name toMongo
 * @version 3.0.0
 * @returns { Subscription }
 * @example
 * ```js
 * ```
 */
Subscriptions.toStu3 = function(subscriptionJson){
  if(subscriptionJson){

    // quick cast from string to boolean
    if(typeof subscriptionJson.birthDate === "string"){
      subscriptionJson.birthDate = new Date(subscriptionJson.birthDate);
    }

    // quick cast from string to boolean
    if(subscriptionJson.deceasedBoolean){
      subscriptionJson.deceasedBoolean = (subscriptionJson.deceasedBoolean == "true") ? true : false;
    }

    // STU3 only has a single entry for family name; not an array
    if(subscriptionJson.name && subscriptionJson.name[0] && subscriptionJson.name[0].family && subscriptionJson.name[0].family[0] ){
      subscriptionJson.name[0].family = subscriptionJson.name[0].family[0];      
    }

    // make sure the full name is filled out
    if(subscriptionJson.name && subscriptionJson.name[0] && subscriptionJson.name[0].family && !subscriptionJson.name[0].text ){
      subscriptionJson.name[0].text = subscriptionJson.name[0].given[0] + ' ' + subscriptionJson.name[0].family;      
    }
  }
  return subscriptionJson;
}


/**
 * @summary Similar to toMongo(), this function prepares a FHIR record for storage in the Mongo database.  The difference being, that this assumes there is already an existing record.
 * @memberOf Subscriptions
 * @name prepForUpdate
 * @version 1.6.0
 * @returns { Object }
 * @example
 * ```js
 *  let subscriptions = Subscriptions.findMrn('12345').fetch();
 * ```
 */

Subscriptions.prepForUpdate = function (subscription) {
  process.env.TRACE && console.log("Subscriptions.prepForUpdate()");  

  if (subscription.name && subscription.name[0]) {
    //console.log("subscription.name", subscription.name);

    subscription.name.forEach(function(name){
      name.resourceType = "HumanName";
    });
  }

  if (subscription.telecom && subscription.telecom[0]) {
    //console.log("subscription.telecom", subscription.telecom);
    subscription.telecom.forEach(function(telecom){
      telecom.resourceType = "ContactPoint";
    });
  }

  if (subscription.address && subscription.address[0]) {
    //console.log("subscription.address", subscription.address);
    subscription.address.forEach(function(address){
      address.resourceType = "Address";
    });
  }

  if (subscription.contact && subscription.contact[0]) {
    //console.log("subscription.contact", subscription.contact);

    subscription.contact.forEach(function(contact){
      if (contact.name) {
        contact.name.resourceType = "HumanName";
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          telecom.resourceType = "ContactPoint";
        });
      }

    });
  }

  return subscription;
};


/**
 * @summary Scrubbing the subscription; make sure it conforms to v1.6.0
 * @memberOf Subscriptions
 * @name scrub
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let subscriptions = Subscriptions.findMrn('12345').fetch();
 * ```
 */

Subscriptions.prepForFhirTransfer = function (subscription) {
  process.env.TRACE && console.log("Subscriptions.prepForFhirTransfer()");  

  return subscription;
};



export { Subscription, Subscriptions, SubscriptionSchema };
