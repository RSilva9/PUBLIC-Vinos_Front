import { createContext, useState, useEffect } from "react";
import wretch from 'wretch';
import { apiUrl } from "../config/config";

const userContext = createContext({
    user: {
        id: null as number | null,
        username: "",
        role: ""
    },
    setUser: (user: { id: number, username: string; role: string }) => {} 
});

function SiteContextProvider(props: any){
    const [user, setUser] = useState({
        id: null as number | null,
        username: "",
        role: ""
    });

    async function fetchUser(){
        try {
            const response = await wretch(`${apiUrl}/usuarios/refresh`)
                .options({ credentials: "include" })
                .get()
                .json<any>();
            setUser(response.user)
        } catch (error) {
            console.error("No se pudo autenticar el usuario.");
            if(window.location.pathname !== "/")
                window.location.assign("/");
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return(
        <userContext.Provider value = {{ user, setUser }}>
            {props.children}
        </userContext.Provider>
    )
}

export { SiteContextProvider };

export default userContext;