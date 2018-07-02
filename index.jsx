
import SubscriptionsPage from './client/SubscriptionsPage';
import SubscriptionTable from './client/SubscriptionTable';
import { Subscription, Subscriptions, SubscriptionSchema } from './lib/Subscriptions';

var DynamicRoutes = [{
  'name': 'SubscriptionPage',
  'path': '/subscriptions',
  'component': SubscriptionsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Subscriptions',
  'to': '/subscriptions',
  'href': '/subscriptions'
}];
var AdminSidebarElements = [{
  'primaryText': 'Subscriptions',
  'to': '/subscriptions',
  'href': '/subscriptions'
}];

export { 
  AdminSidebarElements,
  SidebarElements, 
  DynamicRoutes, 

  SubscriptionsPage,
  SubscriptionTable
};


