import axios from "axios";
import { logout, setUser } from "../redux/userSlice";



export const fetchUserDetails = async (dispatch) => {

    try {
        const response = await axios.get("/api/user-details", { withCredentials: true })
        console.log('user details', response)

        if (response?.data?.data) {
          await dispatch(setUser(response?.data?.data))
        }

        if(response?.data?.data?.logout){
            dispatch(logout())
            
        }

    } catch (error) {
        console.log("error", error)
    }
}

