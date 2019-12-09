import React,{Component} from 'react';
import { graphql } from "react-apollo";
import {addMenuMutation} from '../../queries/queries';

class MenuAddForm extends Component {
     constructor(props){
        super(props);
        
        this.state = {
            // sections: [],
            name: "",
            description: "",
            price: "",
            section: "",
            message: "",
            isNewImage: false
        }
        //Bind the handlers to this class
        this.changeHandler = this.changeHandler.bind(this);
        this.submitAdd = this.submitAdd.bind(this);
    }

    //input change handler to update state variable with the text entered by the user
    changeHandler(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }


    //submit Login handler to send a request to the node backend
    submitAdd = (e) => {
        //prevent page from refresh
        e.preventDefault();

        let section = this.props.sections.find(section => section.name === this.state.section);

        this.props.addMenuMutation(
            {
                variables:{
                    ownerId: localStorage.getItem('id'),
                    sectionId: section.id,
                    name : this.state.name,
                    description: this.state.description,
                    price: this.state.price
                }
            }
        )
        .then(res=> {
            console.log(res)
            if(res.data.addMenu.success){
                this.setState({
                    message: res.data.addMenu.message
                })
                this.props.onAdd({
                    id: res.data.addMenu.menuId, section_id: section.id, 
                    name: this.state.name, description: this.state.description, price: this.state.price
                });
            } else {
                this.setState({
                    message: res.data.addMenu.message
                })
            }
        })
        .catch(err=> alert('Error: '+err));
    }

    render(){
        return(
            <div>
                <div className="container">
                <form onSubmit = {this.submitAdd} >
                    <div className="add-menu-form">
                        <div className="main-div">
                            <div className="panel">
                            <h2 style= {{color:"red"}}>{this.state.message}</h2>
                                <h4>Add Menu</h4>
                                <hr/>
                                <div style={{display:'flex'}}>
                                    <div>
                                        <div style={{display:'flex', paddingBottom:'10px', paddingLeft:'100px'}}>
                                            <input required type="text" class="form-control name-input" onChange = {this.changeHandler}
                                            name="name" placeholder="Name"/>
                                            <input required type="text" class="form-control price-input" onChange = {this.changeHandler}
                                            name="price" placeholder="Price"/>
                                        </div>
                                        <div style={{display:'flex', paddingBottom:'10px', paddingLeft:'100px'}}>
                                            <textarea class="form-control desc-textarea" rows="3" name="description" onChange = {this.changeHandler}
                                            placeholder="Enter description of menu here"/>
                                            <div class="form-group">
                                                <select class="form-control" name="section" onChange = {this.changeHandler}>
                                                    <option selected>Select Section</option>
                                                    {this.props.sections.map((section) => (
                                                    <option>{section.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button style={{marginLeft:'300px', width:'80px'}} type = "submit" className="btn btn-primary">Add</button> 
                                
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            
        
        )
    }
}

export default graphql(addMenuMutation, {
    name: "addMenuMutation"
  })(MenuAddForm);