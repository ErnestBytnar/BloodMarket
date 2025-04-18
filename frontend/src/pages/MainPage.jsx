import { useEffect, useState } from "react";
import { getUserProfile } from "../api/user";

const MainPage = () => {
    const [username, setUsername] = useState("");
    const [groups, setGroups] = useState([])

    useEffect(()=>{
        const fetchUserData = async ()=>{
            const userData = await getUserProfile();
            if(userData){
                setUsername(userData.username);
                setGroups(userData.groups);
            }
        };

        fetchUserData();
    },[]);
    
    return (
        <div>
            <h1>Strona główna</h1>
                <div>
                <p>Nazwa</p>
                {username}
                <p>Grupy</p>
                {groups}

                </div>

        </div>
    );
};

export default MainPage;