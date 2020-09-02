import React, { useState } from "react"
import { Redirect } from 'react-router-dom'

import "./Register.css"

import {GetSocket,GlobalSetUserName,GlobalSetUserPic} from "../../Socket.js"

let filereader;

const Register = () => {
    const [lUserName,lSetUserName] = useState("");
    const [lPassword,lSetPassword] = useState("");
    const [File,SetFile] = useState("");
    const [shouldRedirect,SetshouldRedirect] = React.useState(false);
   
    const sendRegister = (event) => {
      event.preventDefault();
      
      if(lUserName && lPassword && File) {

        GetSocket().emit('RegisterMsg', { UserName: lUserName, Password: lPassword, PPb64 : File}, ({ error, success }) => {
         
          if (error)
            alert(error);      
         
          if (success)
          {
            alert(success);      
           
            GlobalSetUserName(lUserName);
            
            if (File !== "")
              GlobalSetUserPic(File);

            SetshouldRedirect(true);
          }
            
        });
      }
      else  
        alert("Username,Password,ProfilePic Required");  
    }

    const HandleFileRead = (e) =>
    {   
      SetFile(filereader.result); 
    }
    
    const HandleFileChosen = (file) =>
    {
      const filesize = ((file.size/1024)/1024).toFixed(4); // MB

      if (filesize > 3)
      {
        alert("File Is To Big (3 MB) MAX");
        return;
      }

      filereader = new FileReader();
      filereader.onloadend = HandleFileRead;
      filereader.readAsDataURL(file);  
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        sendRegister(event);
      }
    }
      

    function SmartDragDrop() {
      
      if (File !== "") {
        return (    
          <div className="Neon Neon-theme-dragdropbox">
          <img className="reg-selected-image" src={File} alt="Red dot" />
          </div>
        );
      }
      
      return (
        <div className="Neon Neon-theme-dragdropbox">
        <input className="reg-myinput" name="files[]" id="filer_input2" type="file" accept="image/x-png,image/gif,image/jpeg" onChange={e => HandleFileChosen(e.target.files[0])}/>     
         <div className="Neon-input-dragDrop">
          <div className="Neon-input-inner">
            <div className="Neon-input-icon"><i className="fa fa-file-image-o"></i></div>
            <div className="Neon-input-text">
              <h3>Upload Your Profile Picture</h3> 
              <span className="spanstyle">Drag &amp; Drop</span>
              </div>
              { /* eslint-disable-next-line */ }
              <a  className="Neon-input-choose-btn blue">Browse Files</a>
              { /* eslint-disable-next-line*/ }
              </div>
              </div>
        </div>
      );
    }

    return (
      <div className="reg-main">
        <div className="reg-OuterContainer">
        <div className="reg-InnerContainer">
          <h1 className="reg-heading">Register</h1>           
          <div>  
            {SmartDragDrop()}
            <input placeholder="Name" maxLength="18" className="reg-Input" type="text" onChange={(event) => lSetUserName(event.target.value)} />
            <input placeholder="Password" maxLength="20" className="reg-Input" type="password" onChange={(event) => lSetPassword(event.target.value)} onKeyDown={handleKeyDown}/>
          </div>       
            <button className={'reg-regbutton mt-20'} type="submit" onClick={e => sendRegister(e)}>Register</button> 
            {shouldRedirect === true &&
             <Redirect to={`/chat`} /> 
            }   
        </div>

      </div>
      </div>
    )
}


export default Register;