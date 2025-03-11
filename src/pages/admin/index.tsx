import LoginForm from '@/components/LoginForm'
import PageLayout from '@/components/layout/PageLayout'
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PageHead from '@/components/layout/PageHead';

const AdminPage = () => {
    return (
        <PageLayout>
            <PageHead
                title="Robotics Society of PEC Admin"
                description="You are in full control"
            />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="border-none shadow-lg">
                            <CardHeader className="space-y-1 text-center">
                                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LoginForm />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </PageLayout>

    )
}

export default AdminPage