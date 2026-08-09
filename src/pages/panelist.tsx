import PanelistLoginForm from '@/components/panelist/PanelistLoginForm'
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PageHead from '@/components/layout/PageHead';

const PanelistPage = () => {
    return (
        <>
            <PageHead
                title="Robotics Society of PEC - Panelist Login"
                description="Panelist Access"
            />
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="border-none shadow-lg">
                            <CardHeader className="space-y-1 text-center">
                                <CardTitle className="text-2xl font-bold tracking-tight">Panelist Login</CardTitle>
                                <CardDescription>
                                    Enter your panel credentials
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PanelistLoginForm />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default PanelistPage
