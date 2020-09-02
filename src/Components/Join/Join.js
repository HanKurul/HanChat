import React,{ useState}  from "react"
import {Link,Redirect} from "react-router-dom"
import "./Join.css"

import {GetSocket,GlobalSetUserName,GlobalSetUserPic} from "../../Socket.js"


const Join = () => {
  const [lUserName,lSetUserName] = useState("");
  const [lPassword,lSetPassword] = useState("");
  const [shouldRedirect,SetshouldRedirect] = useState(false);

  const sendLogin = (event) => {
    
    event.preventDefault();
   
    if(lUserName && lPassword) {
     
      GetSocket().emit('LoginMsg', { UserName: lUserName, Password: lPassword }, ({ error, success,ProfilePic }) => {
       
        if (error)
          alert(error);      
       
          if (success)
          {          
            if (ProfilePic)  
            {
              GlobalSetUserPic(ProfilePic);
            }     

            GlobalSetUserName(lUserName);  
                     
            alert(success); 
             
            SetshouldRedirect(true);
          }

      });
    } 
    else  
    alert("Username And Password Required");  
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendLogin(event);
    }
  }
    
    return (
      <div className="join-main">
        <div className="join-OuterContainer">
        <div className="join-InnerContainer">
          <h1 className="join-heading">Join</h1>
          <div>
            <input placeholder="Name" className="join-Input" type="text" onChange={(event) => lSetUserName(event.target.value)} />
            <input placeholder="Password" className="join-Input" type="password" onChange={(event) => lSetPassword(event.target.value)} onKeyDown={handleKeyDown} />
          </div>

          <button className={'join-loginbutton mt-20'} type="submit" onClick={e => sendLogin(e)}>Sign In</button> 

          <Link to={`/register`}>
            <button className={'join-regbutton mt-20'} type="submit">Register</button>
          </Link>

          {
          shouldRedirect === true &&
          <Redirect to={`/chat`} />         
          }   

        </div>
      </div>
      </div>
    )
}

export default Join;