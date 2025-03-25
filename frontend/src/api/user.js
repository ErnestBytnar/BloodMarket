const API_URL = "http://127.0.0.1:8000/api/user/";

export const getUserProfile = async () =>{

    try{
        const token = localStorage.getItem("access_token");
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });


        if(!response.ok){
            throw new Error(`Błąd: ${response.status}`);
        }

        return await response.json();
    }

    catch (error) {
        console.error("Bład przy pobieraniu danych użytwkonika", error);
        return null;
    }
};