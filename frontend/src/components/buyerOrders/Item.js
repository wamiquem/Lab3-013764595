import React,{Component} from 'react';
import backendURL from '../../urlconfig';

class Item extends Component {
     constructor(props){
        super(props);

        
    }


    render(){
        console.log(this.state)
        return(
                <div className="item-list-panel">
                    <div style = {{display:'flex', float: 'left', width: '80%'}}>
                        <div>
                            <label style = {{paddingLeft:'5px'}}>{this.props.item.name}</label>  
                            <p style = {{paddingLeft:'5px'}}>{this.props.item.description}</p>
                            <p style = {{paddingLeft:'5px'}}>{`$${this.props.item.price}`}</p>
                            
                        </div> 
                    </div>
                </div>
        )
    }
}

export default Item;