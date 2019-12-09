import React,{Component} from 'react';
import backendURL from '../../urlconfig';

class Menu extends Component {
     constructor(props){
        super(props);
        //Bind the handlers to this class
    }

    render(){

        return(
            <div>
                <hr/>
            <div className = "menu-card" >
                
                <div>
                    <div style={{display:'flex', paddingBottom:'10px', paddingLeft:'100px'}}>
                        <input type="text" class="form-control name-input" 
                         disabled
                        value = {this.props.menu.name} name="name" placeholder="Name"/>
                        <input type="text" class="form-control price-input" 
                         disabled
                        value = {this.props.menu.price} name="price" placeholder="Price"/>
                    </div>
                    <div style={{display:'flex', paddingBottom:'10px', paddingLeft:'100px'}}>
                        <textarea class="form-control desc-textarea" rows="3" name="description" 
                         disabled
                        value = {this.props.menu.description} placeholder="Enter description of menu here"/>
                        <div class="form-group">
                            <select class="form-control" name="section" 
                             disabled>
                                <option selected>Select Section</option>
                                {this.props.sections.map((section) => {
                                    if(section.id === this.props.menu.section_id){
                                        return <option selected>{section.name}</option> ;
                                    } else {
                                        return <option>{section.name}</option> ;
                                    }
                                }
                                
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
                
            
            </div>
        )
    }
}

export default Menu;