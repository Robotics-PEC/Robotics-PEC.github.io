import Admin from '@/components/Admin';
import WrongPage from '@/components/WrongPage';
import { client } from '@/lib/supabase/supabase';
import React, { useEffect, useState } from 'react'

const AdminPage = () => {
    const [validUser, setValidUser] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await client.auth.getSession();

            if (session) {
                setValidUser(true);
                return;
            }
            return;
        }
        client.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                localStorage.clear();
            }
        })
        checkSession();
    }, []);

    return (
        <>
            {
                validUser ? (
                    <Admin />
                ) : (
                    <WrongPage />
                )
            }
        </>
    )
}

export default AdminPage