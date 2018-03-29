import { CardText, CardTitle } from 'material-ui/Card';
import { Tab, Tabs } from 'material-ui/Tabs';
import { GlassCard, Glass, VerticalCanvas, FullPageCanvas } from 'meteor/clinical:glass-ui';

import SubscriptionDetail from './SubscriptionDetail';
import SubscriptionTable from './SubscriptionTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { Session } from 'meteor/session';

let defaultSubscription = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('subscriptionFormData', defaultSubscription);
Session.setDefault('subscriptionSearchFilter', '');

export class SubscriptionsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('subscriptionPageTabIndex'),
      subscription: defaultSubscription,
      subscriptionSearchFilter: '',
      currentSubscription: null
    };

    if (Session.get('subscriptionFormData')) {
      data.subscription = Session.get('subscriptionFormData');
    }
    if (Session.get('subscriptionSearchFilter')) {
      data.subscriptionSearchFilter = Session.get('subscriptionSearchFilter');
    }
    if (Session.get("selectedSubscription")) {
      data.currentSubscription = Session.get("selectedSubscription");
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("SubscriptionsPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('subscriptionPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedSubscription', false);
    Session.set('subscriptionUpsert', false);
  }

  render() {
    console.log('React.version: ' + React.version);
    return (
      <div id="subscriptionsPage">
        <FullPageCanvas>
          <GlassCard height="auto">
            <CardTitle
              title="Subscriptions"
            />
            <CardText>
              <Tabs id='subscriptionsPageTabs' default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
                 <Tab className="newSubscriptionTab" label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                   <SubscriptionDetail id='newSubscription' />
                 </Tab>
                 <Tab className="subscriptionListTab" label='Subscriptions' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                   <SubscriptionTable showBarcodes={true} />
                 </Tab>
                 <Tab className="subscriptionDetailTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                   <SubscriptionDetail id='subscriptionDetails' currentSubscription={this.data.currentSubscription} />
                 </Tab>
             </Tabs>


            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(SubscriptionsPage.prototype, ReactMeteorData);

export default SubscriptionsPage;