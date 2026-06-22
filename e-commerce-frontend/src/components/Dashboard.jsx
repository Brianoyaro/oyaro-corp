import { useProfile } from "../hook/userProfileHook";
import { useNavigate, Link } from 'react-router-dom';


export function Dashboard() {
    const { data: user, isLoading } = useProfile();
    const navigate = useNavigate();

    if (isLoading) {
        return(
         <p>Loading....</p>
        )
    }
    
    if (user.role.toLowerCase().includes("ADMIN".toLowerCase())) {
        // navigate them to admin-dahboard page
        // return(
        //  <p>Admin Dashboard</p>
        // )
        navigate('/admin-home', {replace:true})
    } else {
        // navigate them to Home which requires no authentication or the previous url which forced them to login
        // return <p>Client Dashboard</p>
        navigate('/home', {replace:true});
    }
}

