import React from "react";
import { Switch, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import OrdersList from "./components/OrdersList";

function App() {
  return (
    <div>
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/orders"]} component={OrdersList} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
