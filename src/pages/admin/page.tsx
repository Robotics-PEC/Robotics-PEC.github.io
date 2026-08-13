import Admin from '@/components/Admin';
import PageHead from '@/components/layout/PageHead';
import NotFound from '@/pages/404';
import { client } from '@/lib/supabase/supabase';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

const AdminPage = () => {
    const [validUser, setValidUser] = useState(false);
    const router = useRouter();

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
                setValidUser(false);
                router.replace("/login");
            }
        })
        checkSession();
    }, [router]);

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