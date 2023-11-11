'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowBigLeft} from "lucide-react";
import {UserButton} from "@clerk/nextjs";
import {Separator} from "@/components/ui/separator";
import SelectBodyDialog from "@/components/SelectBodyDialog";
import {useState} from "react";
import SelectExerciseDialog from "@/components/SelectExerciseDialog";
import AddExerciseDialog from "@/components/AddExerciseDialog";

type Props = {};

const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`;
}



const DashboardPage = (props: Props) => {

    const today = getDate()

    const [selectedExercise, setSelectedExercise] = useState("");

    const [isBodyDialogOpen, setIsBodyDialogOpen] = useState(false);
    const [selectedBodyPart, setSelectedBodyPart] = useState("")
    const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
    const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);



    const handleBodyPartSelected = (bodyPart:any) => {
        setSelectedBodyPart(bodyPart);
        setIsBodyDialogOpen(false);
        setIsExerciseDialogOpen(true);
    };

    const handleExerciseSelected = (exercise:any) => {
        // This is where you would handle the exercise selection,
        // for example, opening a dialog to choose the number of sets.
        setSelectedExercise(exercise.exercise)
        setIsExerciseDialogOpen(false)
        setIsAddExerciseDialogOpen(true)
    };


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
                        <h1 className="text-3xl font-bold text-gray-900">{today}</h1>
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

                {/* display all the exercises*/}
                <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
                    <SelectBodyDialog
                        isOpen={isBodyDialogOpen}
                        onOpenChange={() => setIsBodyDialogOpen(prev => !prev)}
                        onBodyPartSelected={handleBodyPartSelected}
                    />
                    {isExerciseDialogOpen && <SelectExerciseDialog
                        isOpen={isExerciseDialogOpen}
                        onOpenChange={() => setIsExerciseDialogOpen(prev => !prev)}
                        bodyPart={selectedBodyPart}
                        onExerciseSelected={handleExerciseSelected}
                    />}
                    {isAddExerciseDialogOpen && <AddExerciseDialog
                        isOpen={isAddExerciseDialogOpen}
                        onOpenChange={() => setIsAddExerciseDialogOpen(prev => !prev)}
                        exercise={selectedExercise} />
                    }
                </div>
            </div>
        </div>

        </>
    );
};
export default DashboardPage;
