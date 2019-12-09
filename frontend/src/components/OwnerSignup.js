import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import Navbar from './Navbar';
import { graphql } from "react-apollo";
import { ownerSignupMutation } from "../queries/queries";

//create the Owner Signup Component
class OwnerSignup extends Component {
     //call the constructor method
     constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            fname : "",
            lname : "",
            email : "",
            password: "",
            restName: "",
            restZip: "",
            message: "",
            phone: "",
            success: false
        }
        //Bind the handlers to this class
        this.changeHandler = this.changeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
        this.createStorage = this.createStorage.bind(this);
    }

    //Call the Did Mount to set the auth Flag to false
    componentDidMount(){
        // this.setState({
        //     success : false
        // })
    }

    //Name and email change handlers to update state variable with the text entered by the user
    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    
    //submit Login handler to send a request to the node backend
    submitSignup = (e) => {
        //prevent page from refresh
        e.preventDefault();
        this.props.ownerSignupMutation(
            {
                variables:{
                    fname: this.state.fname,
                    lname: this.state.lname,
                    email : this.state.email,
                    password : this.state.password,
                    restName: this.state.restName,
                    restZip: this.state.restZip,
                    phone: this.state.phone
                }
            }
        )
        .then(res => {
            console.log(res);
            if(res.data.ownerSignup.success){
                localStorage.setItem("ownerId",res.data.ownerSignup.id);
                localStorage.setItem("restaurantName", this.state.restName);
                localStorage.setItem("restaurantZip", this.state.restZip);
                this.setState({
                    success : true
                });
            } else {
                this.setState({
                    success : false,
                    message: res.data.ownerSignup.message
                });
            }
        })
        .catch(err=> alert('Error: '+err));
    }

    createStorage = ({id, restName, restZip}, successcb) => {
        localStorage.setItem("ownerId",id);
        localStorage.setItem("restaurantName", restName);
        localStorage.setItem("restaurantZip", restZip);
        successcb("Local Storage created");
    }

    render(){
        //if Cookie is set render Owner Home Page
        let redirectVar = null;
        if(this.state.success){
            redirectVar = <Redirect to= "/owner/addRestaurant"/>
        }
        return(
            <div>
                {redirectVar}

                <Navbar/>
                
                <div className="container">
                    <form onSubmit = {this.submitSignup}>
                    <div className="signup-form">
                        <div className="main-div">
                            <div className="panel">
                            <h2 style= {{color:"red"}}>{this.state.message}</h2>
                                <h2>Owner Signup</h2>
                                <p>Create your account</p>
                            </div>
                            
                            <div className="form-group">
                                <input required onChange = {this.changeHandler} type="text" className="form-control" name="fname" placeholder="First Name"/>
                            </div>
                            <div className="form-group">
                                <input required onChange = {this.changeHandler} type="text" className="form-control" name="lname" placeholder="Last Name"/>
                            </div>
                            <div className="form-group">
                                <input  required onChange = {this.changeHandler} type="email" className="form-control" name="email" placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <input required onChange = {this.changeHandler} type="password" className="form-control" name="password" placeholder="Password"/>
                            </div>
                            <div className="form-group">
                                <input required onChange = {this.changeHandler} type="number" min="1" step="1" className="form-control" name="phone" placeholder="Phone"/>
                            </div>
                            <div className="form-group">
                                <input required onChange = {this.changeHandler} type="text" className="form-control" name="restName" placeholder="Restaurant Name"/>
                            </div>
                            <div className="form-group">
                                <input required onChange = {this.changeHandler} type="number" min="1" step="1" className="form-control" name="restZip" placeholder="Restaurant Zip"/>
                            </div>
                            <button type = "submit" className="btn btn-primary">Create Account</button>                 
                        </div>
                        <p>Have Account? <Link to="/owner/login" >Login</Link></p>
                    </div>
                    </form>
                </div>
            </div>
            
        
        )
    }
}

export default graphql(ownerSignupMutation, { name: "ownerSignupMutation" })(OwnerSignup);