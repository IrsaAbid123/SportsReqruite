import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    // ✅ Load user from localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                // Clear invalid data
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
