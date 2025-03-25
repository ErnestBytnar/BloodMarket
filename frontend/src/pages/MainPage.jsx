import { useEffect, useState } from "react";
import { getUserProfile } from "../api/user";

const MainPage = () => {
    const [username, setUsername] = useState("");

    useEffect(()=>{
        const fetchUserData = async ()=>{
            const userData = await getUserProfile();
            if(userData){
                setUsername(userData.username);
            }
        };

        fetchUserData();
    },[]);
    
    return (
        <div>
            <h1>Strona główna</h1>
                <div>
                <p>to strona!</p>
                {username}
                </div>

        </div>
    );
};

export default MainPage;