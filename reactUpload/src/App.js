import React from 'react';
import Login from './page/login'
import Upload from './page/upload'
import { HashRouter , Switch ,Route } from 'react-router-dom'
import 'antd/dist/antd.css'

function App() {
  return (
    <div style={{height:'100%'}}>
      <HashRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/login' exact component={Login} />
        <Route path='/upload' exact component={Upload} />
      </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
