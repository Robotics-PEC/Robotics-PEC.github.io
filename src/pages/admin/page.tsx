import Admin from '@/components/Admin';
import PageHead from '@/components/layout/PageHead';
import NotFound from '@/pages/404';
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
            <PageHead
                title="Robotics Society of PEC Admin"
                description="You are in full control"
            />
            {validUser ? (<Admin />) : (< NotFound />)}
        </>
    )
}

export default AdminPage