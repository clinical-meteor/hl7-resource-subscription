import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import { HTTP } from 'meteor/http';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';

//import { Subscriptions } from '../../lib/Subscriptions';
import { Session } from 'meteor/session';
import { has, get } from 'lodash';
import { TableNoData } from 'meteor/clinical:glass-ui';

export class SubscriptionTable extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        hideOnPhone: {
          visibility: 'visible',
          display: 'table'
        },
        cellHideOnPhone: {
          visibility: 'visible',
          display: 'table',
          paddingTop: '16px'
        },
        cell: {
          paddingTop: '16px'
        }
      },
      selected: [],
      subscriptions: []
    };

    let query = {};
    if(this.props.patient){
      query['patient.display'] = this.props.patient;
    }

    let options = {};
    // number of items in the table should be set globally
    if (get(Meteor, 'settings.public.defaults.paginationLimit')) {
      options.limit = get(Meteor, 'settings.public.defaults.paginationLimit');
    }

    // but can be over-ridden by props being more explicit
    if(this.props.limit){
      options.limit = this.props.limit;      
    }

    // data.subscriptions = [];
    data.subscriptions = Subscriptions.find(query, options).map(function(document){
      let result = {
        _id: document._id,
        status: get(document, 'status', ''),
        criteria: get(document, 'criteria', ''),
        type: get(document, 'channel.type', ''),
        endpoint: get(document, 'channel.endpoint', ''),
        payload: get(document, 'channel.payload', ''),
        options: JSON.stringify(get(document, 'channel.options', ''))
      };
      return result;
    });

    // console.log("SubscriptionTable[data]", data);
    return data;
  }
  rowClick(id){
    Session.set('subscriptionsUpsert', false);
    Session.set('selectedSubscription', id);
    Session.set('subscriptionPageTabIndex', 2);
  }
  render () {
    let tableRows = [];
    let footer;

    if(this.data.subscriptions.length === 0){
      // don't try to simplifiy the double negative in this expression
      // it's handling a boolean property, and also serving up instructions/help/warning
      // it's klunky to reason through; but it's not hurting anything
      if(!(this.props.noDataMessage === false)){
        footer = <TableNoData />
      }
    } else {
      for (var i = 0; i < this.data.subscriptions.length; i++) {
        tableRows.push(
          <tr key={i} className="subscriptionRow" style={{cursor: "pointer"}}>
  
            <td className='status' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].status}</td>
            <td className='criteria' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].criteria}</td>
            <td className='type' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].type}</td>
            <td className='endpoint' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].endpoint}</td>
            <td className='payload' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].payload}</td>
            <td className='options' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].options}</td>
          </tr>
        );
      }  
    }

    return(
      <div>
        <Table id='subscriptionsTable' hover >
        <thead>
          <tr>
            <th className='status'>status</th>
            <th className='criteria'>criteria</th>
            <th className='type'>type</th>
            <th className='endpoint'>endpoint</th>
            <th className='payload'>payload</th>
            <th className='options'>options</th>
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
      { footer }
      </div>
    );
  }
}


ReactMixin(SubscriptionTable.prototype, ReactMeteorData);
export default SubscriptionTable;