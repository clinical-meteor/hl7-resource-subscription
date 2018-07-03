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


#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).




