import React,{Component} from 'react';
import backendURL from '../urlconfig';
import { graphql, withApollo } from "react-apollo";
import {buyerProfile, updateBuyerProfileMutation} from '../queries/queries';
import { compose } from "recompose"

//create the Buyer Profile Component
class BuyerProfile extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

        this.state = {
            message: "",
            isEditable:false,
            isNewImage: false,
            fname: "",
            lname: "",
            phone: "",
            street: "",
            unit: "",
            city: "",
            state: "",
            zip: "",
            imgURL: ""
        }
    }

    componentDidMount(){
        this.props.client.query({
            query: buyerProfile,
            variables: {
              id: localStorage.getItem('id')
                }
            })
            .then(res => {
                console.log("res5555=",res)
                this.setState({
                    fname: res.data.buyerProfile.buyer.fname,
                    lname: res.data.buyerProfile.buyer.lname,
                    phone: res.data.buyerProfile.buyer.phone,
                    street: res.data.buyerProfile.buyer.street,
                    unit: res.data.buyerProfile.buyer.unit_no,
                    city: res.data.buyerProfile.buyer.city,
                    state: res.data.buyerProfile.buyer.state,
                    zip: res.data.buyerProfile.buyer.zip_code
                });
            })
            .catch(err=> alert('Error: '+err));

    }
    
    //input change handler to update state variable with the text entered by the user
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    editProfile = () => {
        this.setState({
            isEditable: true
        });
    }

    cancelEdit = () => {
        this.setState({
            isEditable: false
        });
    }

  

    updateProfile = (e) => {
        e.preventDefault();

        this.props.updateBuyerProfileMutation(
            {
                variables:{
                    id: localStorage.getItem('id'),
                    fname: this.state.fname,
                    lname: this.state.lname,
                    phone: this.state.phone,
                    street: this.state.street,
                    unit: this.state.unit,
                    city: this.state.city,
                    state: this.state.state,
                    zip: this.state.zip
                }
            }
        )
        .then(res=> {
            console.log(res)
            if(res.data.updateBuyerProfile.success){
                this.setState({
                    message: res.data.updateBuyerProfile.message,
                    isEditable: false
                })
            } else {
                this.setState({
                    message: res.data.updateBuyerProfile.message
                })
            }
        })
        .catch(err=> alert('Error: '+err));
        
    }

    render(){
        let profileEdit = null;
        let profileUpdate = null;
        
        if(this.state.isEditable){
            
            
            profileUpdate = (
                <div className = "btn-toolbar">
                    <button type = "submit" className="btn btn-success">Update</button>
                    <button onClick = {this.cancelEdit} className="btn btn-danger">Cancel</button>
                </div>    
            );
        }else{
            profileEdit = (
                <div>
                    <button onClick = {this.editProfile} className="btn btn-primary">Edit</button>
                </div>
            );
        }
        
        return(
            <div>
                
                <div className="container">
                    <form onSubmit = {this.updateProfile}>
                    <div className="profile-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2 style= {{color:"red"}}>{this.state.message}</h2>
                                <h2>Buyer Profile</h2>
                                <p>View or Update Profile</p>
                            </div>
                            
                            <div className="form-group form-inline">
                                <label >First Name</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="text" className="form-control" name="fname" placeholder="First Name"
                                value = {this.state.fname}/>
                            
                            </div>
                            <div className="form-group form-inline">
                                <label >Last Name</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="text" className="form-control" name="lname" placeholder="Last Name"
                                value = {this.state.lname}/>
                            </div>
                            <div className="form-group form-inline">
                                <label >Phone</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="number" min="1" step="1" className="form-control" name="phone" placeholder="Phone"
                                value = {this.state.phone}/>
                            </div>
                            <div className="form-group form-inline">
                                <label >Street</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="text" className="form-control" name="street" placeholder="Street"
                                value = {this.state.street}/>
                            </div>
                            <div className="form-group form-inline">
                                <label >Unit</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="number" min="1" step="1" className="form-control" name="unit" placeholder="Unit"
                                value = {this.state.unit}/>
                            </div>
                            <div className="form-group form-inline">
                                <label >City</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="text" className="form-control" name="city" placeholder="City"
                                value = {this.state.city}/>
                            </div>
                            <div className="form-group form-inline">
                                <label >State</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="text" className="form-control" name="state" placeholder="State"
                                value = {this.state.state}/>
                            </div>
                            <div className="form-group form-inline">
                                <label >Zip</label>
                                <input required disabled={!this.state.isEditable} onChange = {this.handleChange} 
                                type="number" min="1" step="1" className="form-control" name="zip" placeholder="Zip"
                                value = {this.state.zip}/>
                            </div>
                                {profileUpdate}   
                                {profileEdit}          
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            
        
        )
    }
}

export default compose(
    withApollo,
    graphql(updateBuyerProfileMutation, { name: "updateBuyerProfileMutation" })
    )(BuyerProfile);