/* By Han Kurul*/
import React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom"

import Join from "./Components/Join/Join"
import NewChat from "./Components/NewChat/NewChat"
import Register from "./Components/Register/Register"


const App = () => {
    return (
        <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={NewChat}/>
        <Route path="/register" component={Register} />
        </Router>
    )
}

export default App;


/*
* Route path="/chat" render={(props) => (<Chat {...props} Username={Username} /> )}></Route>
*/