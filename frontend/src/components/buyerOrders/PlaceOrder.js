import React,{Component} from 'react';
import Navbar from '../Navbar';
import { Redirect, Link } from 'react-router-dom';
import Item from './Item'
import backendURL from '../../urlconfig';
import { withApollo } from "react-apollo";
import {getSectionsWithMenus} from '../../queries/queries';

class PlaceOrder extends Component {
     constructor(props){
        super(props);
        this.cart = {
            restId: "",
            restName: "",
            ownerId: "",
            items: []
        };
        this.state = {
            sections: [],
            items: [],
            restId: props.match.params.restId,
            restName: props.location.restName,
            ownerId: props.location.ownerId,
            isCartEmpty: true
        }
        this.addToCart = this.addToCart.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        }
    
    componentDidMount(){
        this.props.client.query({
            query: getSectionsWithMenus,
            variables: {
              ownerId: this.state.ownerId
                }
            })
            .then(res => {
                let sections = res.data.getSectionsWithMenus.sections.map(section => {
                    return{
                        name: section.name,
                        id: section._id
                    }
                });
                let sectionsWithMenus = res.data.getSectionsWithMenus.sections.filter(section => section.menus);
                let items = sectionsWithMenus.map(section => {
                    let availableMenus = section.menus.map( menu => {
                        return{
                            initial_section_id: section._id,
                            section_id: section._id,
                            id: menu._id,
                            name: menu.name,
                            description: menu.description,
                            price: menu.price,
                            image: menu.image
                        }
                    })
                    return availableMenus;
                })
                items = items.flat();
                this.setState({
                    items : this.state.items.concat(items),
                    sections: this.state.sections.concat(sections)
                });
            })
            .catch(err=> alert('Error: '+err));
            
            if(localStorage.getItem('cart')){
                const cart = JSON.parse(localStorage.getItem('cart'));
                this.cart = cart;
                this.setState({
                    isCartEmpty : false
                });
            }

    }

    addToCart(restId, restName, ownerId, items){
        if(this.cart.restId !== restId){
            this.cart.restId = restId;
            this.cart.restName = restName;
            this.cart.ownerId = ownerId;
            this.cart.items = items;
        } else {
            var itemExists = this.cart.items.findIndex(cartItem => cartItem.id === items[0].id);
            if(itemExists === -1){
                this.cart.items = this.cart.items.concat(items);
            } else {
                this.cart.items[itemExists].quantity = items[0].quantity;
            }
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.setState({
            isCartEmpty : false
        });
    }

    handleEditChange(menuId, name, value){
        this.props.onEditChange(menuId, name, value);
    }

    render(){
        let redirectVar = null;
        let fname = null;
        if(!localStorage.getItem('token')){
            redirectVar = <Redirect to= "/buyer/login"/>
        } else {
            fname = localStorage.getItem('fname');
          }
        return(
            <div>
                {redirectVar}
                <Navbar firstName = {fname}/>
                    <div className="order-item-list">
                        <div className="main-div">
                            <h4>Menu Items</h4>
                            <hr/>
                            {
                                this.state.sections.map(section => {
                                    return(
                                        <div>
                                            <label>{section.name}</label>
                                            <div style = {{display:'flex', flexWrap:'wrap'}}>
                                            {
                                            this.state.items.filter(item => item.section_id === section.id)
                                            .map(item => {
                                                return <Item item = {item} onAdd = {this.addToCart}/>
                                            })
                                            }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                            </div>
                    </div>
                </div>
            
            
        
        )
    }
}

export default withApollo(PlaceOrder);