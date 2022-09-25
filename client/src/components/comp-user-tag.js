import { useState} from 'react';

import * as u from './../scripts/utils'; 

export default function UserTag(props) {
 
  const [isActive,setIsactive] = useState(false);
  
  let component = 
    <div className={'user-tag '+(isActive?'active':'')} onClick={()=>setIsactive(!isActive)}>
      <div className='user-row'>
        <div className='image'>
          {props.image&& <img src={props.image} alt='user-profile'/>}
        </div>
        <p className='name'>{props.name}</p>
      </div>
      <div className='logout' onClick={()=>u.logout()}>
        <span className='material-icons'>logout</span>
        <p>Logout</p>
      </div>
    </div>;

  return component;
}