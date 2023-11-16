import {Button} from "@/components/ui/button";
import TypewriterTitle from "@/components/TypewriterTitle";
import Link from "next/link";
import {ArrowBigRight, ArrowRight} from "lucide-react";





export default function Home() {

    return (
        <div className="bg-gradient-to-r min-h-screen from-pink-500 via-red-500 to-yellow-500">
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="font-semibold text-7xl text-center">
                    Dynamic <span className="text-white font-bold">Training</span> Logger.
                </h1>
                <div className="mt-4"></div>
                <h2 className="font-semibold text-3xl text-center text-slate-200">
                    <TypewriterTitle />
                </h2>
                <div className="mt-8"></div>
                <div className="flex justify-center">
                    <Link href='/dashboard'>
                        <Button className="bg-amber-500">
                            Get Started
                            <ArrowBigRight className="ml-2 w-4 h-4" strokeWidth={3}/>
                        </Button>

                    </Link>
                </div>

            </div>
        </div>
    )

}