import {createBrowserRouter} from "react-router-dom"
import Home from "../pages/Home"
import Battle from "../pages/battle"
import App from "../App"
import Hello from "../pages/Hello";

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
            },
            {
                path: "/hello",
                element: <Hello />
            }
        ]
    }
]);

export default router