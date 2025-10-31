import {createBrowserRouter} from "react-router-dom"
import Home from "../pages/Home"
import Battle from "../pages/battle"
import App from "../App"

const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element :<Home/>
            },
            {
                path:"/battle",
                element :<Battle/>
            }
        ]
    }
]);

export default router