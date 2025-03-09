import Admin from '@/components/Admin';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/supabase/supabase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const AdminPage = () => {
    const router = useRouter();
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

        checkSession();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    }

    return (
        <>
            {
                validUser ? (
                    <div>
                        <Admin />
                    </div>
                ) : (
                    <div>
                        <p>
                            Oops!! You're not supposed to be here!!
                        </p>
                        <Button onClick={handleLogout}>
                            Return To Home
                        </Button>
                    </div>

                )
            }
        </>
    )
}

export default AdminPage