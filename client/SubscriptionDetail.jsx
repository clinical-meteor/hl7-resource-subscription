import { CardActions, CardText } from 'material-ui/Card';
import { get, has, set } from 'lodash';
import { insertSubscription, removeSubscriptionById, updateSubscription } from 'meteor/clinical:hl7-resource-subscription';


import { Bert } from 'meteor/themeteorchef:bert';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';

import { Subscriptions } from '../lib/Subscriptions';
import { Session } from 'meteor/session';


let defaultSubscription = {
  "resourceType" : "Subscription",
  "name" : [{
    "text" : "",
    "resourceType" : "HumanName"
  }],
  "active" : true,
  "gender" : "",
  "birthDate" : '',
  "photo" : [{
    url: ""
  }],
  identifier: [{
    "use": "usual",
    "type": {
      "coding": [
        {
          "system": "http://hl7.org/fhir/v2/0203",
          "code": "MR"
        }
      ]
    },
    "value": ""
  }],
  "test" : false
};


Session.setDefault('subscriptionUpsert', false);
Session.setDefault('selectedSubscription', false);

export default class SubscriptionDetail extends React.Component {
  getMeteorData() {
    let data = {
      subscriptionId: false,
      subscription: defaultSubscription
    };

    if (Session.get('subscriptionUpsert')) {
      data.subscription = Session.get('subscriptionUpsert');
    } else {
      if (Session.get('selectedSubscription')) {
        data.subscriptionId = Session.get('selectedSubscription');
        console.log("selectedSubscription", Session.get('selectedSubscription'));

        let selectedSubscription = Subscriptions.findOne({_id: Session.get('selectedSubscription')});
        console.log("selectedSubscription", selectedSubscription);

        if (selectedSubscription) {
          data.subscription = selectedSubscription;

          if (typeof selectedSubscription.birthDate === "object") {
            data.subscription.birthDate = moment(selectedSubscription.birthDate).add(1, 'day').format("YYYY-MM-DD");
          }
        }
      } else {
        data.subscription = defaultSubscription;
      }
    }

    if(process.env.NODE_ENV === "test") console.log("SubscriptionDetail[data]", data);
    return data;
  }

  render() {
    return (
      <div id={this.props.id} className="subscriptionDetail">
        <CardText>
          <TextField
            id='nameInput'
            ref='name'
            name='name'
            floatingLabelText='name'
            value={ get(this, 'data.subscription.name[0].text', '')}
            onChange={ this.changeState.bind(this, 'name')}
            fullWidth
            /><br/>
          <TextField
            id='genderInput'
            ref='gender'
            name='gender'
            floatingLabelText='gender'
            hintText='male | female | other | indeterminate | unknown'
            value={ get(this, 'data.subscription.gender', '')}
            onChange={ this.changeState.bind(this, 'gender')}
            fullWidth
            /><br/>
          <TextField
            id='birthdateInput'
            ref='birthdate'
            name='birthdate'
            floatingLabelText='birthdate'
            hintText='YYYY-MM-DD'
            value={ get(this, 'data.subscription.birthDate', '')}
            onChange={ this.changeState.bind(this, 'birthDate')}
            fullWidth
            /><br/>
          <TextField
            id='photoInput'
            ref='photo'
            name='photo'
            floatingLabelText='photo'
            value={ get(this, 'data.subscription.photo[0].url', '')}
            onChange={ this.changeState.bind(this, 'photo')}
            floatingLabelFixed={false}
            fullWidth
            /><br/>
          <TextField
            id='mrnInput'
            ref='mrn'
            name='mrn'
            floatingLabelText='medical record number'
            value={ get(this, 'data.subscription.identifier[0].value', '')}
            onChange={ this.changeState.bind(this, 'mrn')}
            fullWidth
            /><br/>
        </CardText>
        <CardActions>
          { this.determineButtons(this.data.subscriptionId) }
        </CardActions>
      </div>
    );
  }
  determineButtons(subscriptionId){
    if (subscriptionId) {
      return (
        <div>
          <RaisedButton id='saveSubscriptionButton' className='saveSubscriptionButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveSubscriptionButton'  className='saveSubscriptionButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  changeState(field, event, value){
    let subscriptionUpdate;

    if(process.env.TRACE) console.log("subscriptionDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new subscription
    if (Session.get('subscriptionUpsert')) {
      subscriptionUpdate = Session.get('subscriptionUpsert');
    } else {
      subscriptionUpdate = defaultSubscription;
    }



    // if there's an existing subscription, use them
    if (Session.get('selectedSubscription')) {
      subscriptionUpdate = this.data.subscription;
    }

    switch (field) {
      case "name":
        subscriptionUpdate.name[0].text = value;
        break;
      case "gender":
        subscriptionUpdate.gender = value.toLowerCase();
        break;
      case "birthDate":
        subscriptionUpdate.birthDate = value;
        break;
      case "photo":
        subscriptionUpdate.photo[0].url = value;
        break;
      case "mrn":
        subscriptionUpdate.identifier[0].value = value;
        break;
      default:

    }
    // subscriptionUpdate[field] = value;
    process.env.TRACE && console.log("subscriptionUpdate", subscriptionUpdate);

    Session.set('subscriptionUpsert', subscriptionUpdate);
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('handleSaveButton()');
    let subscriptionUpdate = Session.get('subscriptionUpsert', subscriptionUpdate);


    if (subscriptionUpdate.birthDate) {
      subscriptionUpdate.birthDate = new Date(subscriptionUpdate.birthDate);
    }
    if(process.env.NODE_ENV === "test") console.log("subscriptionUpdate", subscriptionUpdate);

    if (Session.get('selectedSubscription')) {
      if(process.env.NODE_ENV === "test") console.log("Updating subscription...");

      delete subscriptionUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      subscriptionUpdate.resourceType = 'Subscription';

      Subscriptions.update({_id: Session.get('selectedSubscription')}, {$set: subscriptionUpdate }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Subscriptions.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Subscriptions", recordId: Session.get('selectedSubscription')});
          // Session.set('subscriptionUpdate', defaultSubscription);
          Session.set('subscriptionUpsert', false);
          Session.set('selectedSubscription', false);
          Session.set('subscriptionPageTabIndex', 1);
          Bert.alert('Subscription added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new subscription...", subscriptionUpdate);

      Subscriptions.insert(subscriptionUpdate, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Subscriptions.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Subscriptions", recordId: result});
          Session.set('subscriptionPageTabIndex', 1);
          Session.set('selectedSubscription', false);
          Session.set('subscriptionUpsert', false);
          Bert.alert('Subscription added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('subscriptionPageTabIndex', 1);
  }

  handleDeleteButton(){
    Subscriptions.remove({_id: Session.get('selectedSubscription')}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Subscriptions.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Subscriptions", recordId: Session.get('selectedSubscription')});
        // Session.set('subscriptionUpdate', defaultSubscription);
        Session.set('subscriptionUpsert', false);
        Session.set('subscriptionPageTabIndex', 1);
        Session.set('selectedSubscription', false);
        Bert.alert('Subscription removed!', 'success');
      }
    });
  }
}


ReactMixin(SubscriptionDetail.prototype, ReactMeteorData);
