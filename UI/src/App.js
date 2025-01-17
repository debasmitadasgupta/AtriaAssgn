import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './containers/Home/Home';


function App() {
  return (
    <Router>
    <Switch>
      <Route exact path='/' component={Home}></Route>
    </Switch>
    </Router>
  );
}

export default App;
