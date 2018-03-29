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
        dateTime: moment(get(document, 'dateTime', null)).format("YYYY-MM-DD"),
        status: get(document, 'status', ''),
        patientReference: get(document, 'patient.display', ''),
        subscriptioningParty: get(document, 'subscriptioningParty.0.display', ''),
        organization: get(document, 'organization.0.display', ''),
        policyRule: get(document, 'policyRule', ''),
        exceptType: get(document, 'except.0.type', ''),
        exceptAction: get(document, 'except.0.action.0.coding.0.code', ''),
        exceptClass: '',
        start: get(document, 'period.start', ''),
        end: get(document, 'period.end', '')
      };

      var exceptions;
      if(get(document, 'except.0.class')){
        result.exceptClass = "";
        document.except[0].class.forEach(function(exception){   
          if(result.exceptClass == ''){
            result.exceptClass = exception.code;
          }  else {
            result.exceptClass = result.exceptClass + ' - ' + exception.code;
          }      
        });
      }
      return result;
    });

    if (Session.get('appWidth') < 768) {
      data.style.hideOnPhone.visibility = 'hidden';
      data.style.hideOnPhone.display = 'none';
      data.style.cellHideOnPhone.visibility = 'hidden';
      data.style.cellHideOnPhone.display = 'none';
    } else {
      data.style.hideOnPhone.visibility = 'visible';
      data.style.hideOnPhone.display = 'table-cell';
      data.style.cellHideOnPhone.visibility = 'visible';
      data.style.cellHideOnPhone.display = 'table-cell';
    }

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
  
            <td className='date' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={{minWidth: '100px', paddingTop: '16px'}}>{this.data.subscriptions[i].dateTime }</td>
            <td className='status' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell}>{this.data.subscriptions[i].status}</td>
            <td className='patientReference' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell} >{this.data.subscriptions[i].patientReference }</td>
            <td className='subscriptioningParty' onClick={ this.rowClick.bind('this', this.data.subscriptions[i]._id)} style={this.data.style.cell} >{this.data.subscriptions[i].subscriptioningParty}</td>
            <td className='organization' style={this.data.style.cell} >{this.data.subscriptions[i].organization}</td>
            {/* <td className='policyRule' style={this.data.style.cell} >{this.data.subscriptions[i].policyRule}</td> */}
            <td className='exceptType' style={this.data.style.cell} >{this.data.subscriptions[i].exceptType}</td>
            <td className='exceptAction' style={this.data.style.cell} >{this.data.subscriptions[i].exceptAction}</td>
            <td className='exceptClass' style={this.data.style.cell} >{this.data.subscriptions[i].exceptClass}</td>
          </tr>
        );
      }  
    }

    return(
      <div>
        <Table id='subscriptionsTable' hover >
        <thead>
          <tr>
            <th className='name' style={{minWidth: '100px'}}>date</th>
            <th className='status'>status</th>
            <th className='patientReference'>patient</th>
            <th className='subscriptioningParty' >subscriptioning party</th>
            <th className='organization' >organization</th>
            {/* <th className='rule' >rule</th> */}
            <th className='type' >type</th>
            <th className='action' >action</th>
            <th className='class' >class</th>
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