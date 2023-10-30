import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowBigLeft} from "lucide-react";
import {UserButton} from "@clerk/nextjs";
import {Separator} from "@/components/ui/separator";

type Props = {};
const DashboardPage = (props: Props) => {
    return (
        <>
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-10">
                <div className="h-14"></div>
                <div className="flex justify-between items-center md:flex-row flex-col">
                    <div className="flex items-center">
                        <Link href='/'>
                            <Button className="bg-amber-500" size="sm">
                                <ArrowBigLeft className="mr-1 w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                        <div className="w-4"></div>
                        <h1 className="text-3xl font-bold text-gray-900">My Workout</h1>
                        <div className="w-4"></div>
                        <UserButton />
                    </div>
                </div>
                <div className="h-8"></div>
                <Separator />
                <div className="h-8"></div>
                {/* list exercises */}
                {/* TODO conditionally render */}
                <div className="text-center">
                    <h2 className="text-xl text-gray-500">No exercises added. Click on Add to start. </h2>
                </div>
            </div>
        </div>

        </>
    );
};
export default DashboardPage;
