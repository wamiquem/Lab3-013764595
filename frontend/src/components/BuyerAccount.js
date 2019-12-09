import React,{Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import {Redirect} from 'react-router';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BuyerProfile from './BuyerProfile';

class BuyerAccount extends Component {

    render(){
        //if Cookie is set render Buyer Home Page
        let redirectVar = null;
        let fname = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/buyer/login"/>
        } else {
            fname = localStorage.getItem('fname')
        }
        return(
            <div>
                {redirectVar}
                <Navbar firstName = {fname}/>
                <Sidebar user = {'buyer'} options = {['Profile']} module = {'account'}/>
                <div >
                  <Switch>
                      <Route path="/buyer/account/profile" component={BuyerProfile}/>
                  </Switch>
                </div>
            </div>
        )
    }
}

export default BuyerAccount;