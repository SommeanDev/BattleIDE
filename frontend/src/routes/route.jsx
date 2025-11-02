import {createBrowserRouter} from "react-router-dom"
import Home from "../pages/Home"
import Battle from "../pages/battle"
import App from "../App"
import Hello from "../pages/Hello";
import Dashboard from "../pages/dashboard";
import Leaderboard from "../pages/Leaderboard";

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
                path:"/battle/:roomId",
                element :<Battle/>
            },
            {
                path: "/hello",
                element: <Hello />
            },
            {
                path: "/dashboard",
                element :<Dashboard />
            },
            {
                path: "/leaderboard",
                element :<Leaderboard />
            },
        ]
    }
]);

export default router