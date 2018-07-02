##  clinical:hl7-resource-consent   

HL7 FHIR Resource - Consent


--------------------------------------------  
#### Schema Version 

The resource in this package implements the `FHIR 1.6.0 - STU3 Ballot` version of the Consent resource schema, specified at  [http://hl7.org/fhir/2016Sep/consent.html](http://hl7.org/fhir/2016Sep/consent.html).  


--------------------------------------------  
#### Installation  

```bash
meteor add clinical:hl7-resource-consent
```

You may also wish to install the `autopublish` package, which will set up a default publication/subscription of the Consents collection for logged in users.  You will need to remove the package before going into production, however.

```bash
meteor add clinical:autopublish  
```


--------------------------------------------  
#### Example    

```js
var newConsent = {

};
Consents.insert(newConsent);
```

--------------------------------------------  
#### Extending the Schema  

If you have extra fields that you would like to attach to the schema, extend the schema like so:  

```js
ExtendedConsentSchema = new SimpleSchema([
  ConsentSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Consents.attachSchema( ExtendedConsentSchema );
```

--------------------------------------------  
#### Initialize a Sample Consent  

Call the `initializeConsent` method to create a sample consent in the Consents collection.

```js
Meteor.startup(function(){
  Meteor.call('initializeConsent');
})
```
--------------------------------------------  
#### Server Methods  

This package supports `createConsent`, `initializeConsent`, and `dropConsent` methods.

--------------------------------------------  
#### REST API Points    

This package supports the following REST API endpoints.  All endpoints require an OAuth token.  

```
GET    /fhir-1.6.0/Consent/:id    
GET    /fhir-1.6.0/Consent/:id/_history  
PUT    /fhir-1.6.0/Consent/:id  
GET    /fhir-1.6.0/Consent  
POST   /fhir-1.6.0/Consent/:param  
POST   /fhir-1.6.0/Consent  
DELETE /fhir-1.6.0/Consent/:id
```

If you would like to test the REST API without the OAuth infrastructure, launch the app with the `NOAUTH` environment variable, or set `Meteor.settings.private.disableOauth` to true in you settings file.

```bash
NOAUTH=true meteor
```

--------------------------------------------  
#### Conformance Statement  

This package conforms to version `FHIR 1.6.0 - STU3 Ballot`, as per the Touchstone testing utility.  

![https://raw.githubusercontent.com/clinical-meteor/hl7-resource-consent/master/screenshots/Screen%20Shot%202017-03-18%20at%2010.56.09%20PM.png](https://raw.githubusercontent.com/clinical-meteor/hl7-resource-consent/master/screenshots/Screen%20Shot%202017-03-18%20at%2010.56.09%20PM.png)  


--------------------------------------------  
#### Licensing   

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
