'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowBigLeft} from "lucide-react";
import {auth, useClerk, UserButton} from "@clerk/nextjs";
import {Separator} from "@/components/ui/separator";
import SelectBodyDialog from "@/components/SelectBodyDialog";
import {useState} from "react";
import SelectExerciseDialog from "@/components/SelectExerciseDialog";
import AddExerciseDialog from "@/components/AddExerciseDialog";
import {db} from "@/lib/db";
import {and, eq, gte, lte} from "drizzle-orm";
import {$workouts} from "@/lib/db/schema";
import ExerciseCard from "@/components/ExerciseCard";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CalendarComponent from "@/components/CalendarComponent";
import {endOfDay, format, startOfDay} from "date-fns";

type Props = {};

interface Set {
    weight: string;
    reps: string;
}


interface Exercise {
    id: number;
    name: string;
    userId: string;
    date: Date;
    exercises: unknown
}

const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${date}/${month}/${year}`;
}



const DashboardPage = (props: Props) => {

    const { user } = useClerk();
    const userId = user?.id; // Access the user's ID
    const queryClient = useQueryClient();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    //const [exercises, setExercises] = useState<Exercise[]>([]);

    //const [isLoading, setIsLoading] = useState(true);

    console.log(`selectedDate ${selectedDate}`);

    const { data: exercises, isLoading, isError, refetch } = useQuery({
        queryKey: ['exercises', userId, selectedDate],
        queryFn: async () => {
            if (!userId || !selectedDate) return [];

            const formattedStartOfDay  = format(startOfDay(selectedDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
            const formattedEndOfDay  = format(endOfDay(selectedDate), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');

            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const dateObjectStart = new Date(formattedStartOfDay);
            const dateObjectEnd = new Date(formattedEndOfDay);

            const fetchedExercises = await db.select().from($workouts)
                .where(and(
                    eq($workouts.userId, userId),
                    gte($workouts.date, dateObjectStart),
                    lte($workouts.date, dateObjectEnd)));
            return fetchedExercises;
        },
        enabled: !!userId && !!selectedDate // Fetch only when userId is available
    });

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
                        <CalendarComponent selectedDate={selectedDate} onDateChange={(newDate) => setSelectedDate(newDate)} />
                    </div>
                </div>


                <div className="h-8"></div>
                <Separator />
                <div className="h-8"></div>

                {/*add exercise*/}
                <div className="grid sm:grid-cols-3 md:grid-cols-1 grid-cols-1 gap-2">
                    <SelectBodyDialog
                        isOpen={isBodyDialogOpen}
                        onOpenChange={() => setIsBodyDialogOpen(prev => !prev)}
                        onBodyPartSelected={handleBodyPartSelected}
                    />

                {/* Display all the exercises. If no exercises, display a message */}
                {isLoading ? (
                    <div>Loading...</div>
                ) : isError ? (
                    <div>Error loading exercises.</div>
                ) : exercises && exercises.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.map(exercise => (
                            <div key={exercise.id} className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                                <ExerciseCard exercise={exercise} refetchExercises={refetch} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-xl text-gray-500">No exercises added. Click on Add to start.</h2>
                    </div>
                )}

                    {isExerciseDialogOpen && <SelectExerciseDialog
                        isOpen={isExerciseDialogOpen}
                        onOpenChange={() => setIsExerciseDialogOpen(prev => !prev)}
                        bodyPart={selectedBodyPart}
                        onExerciseSelected={handleExerciseSelected}
                    />}
                    {isAddExerciseDialogOpen && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <AddExerciseDialog
                        isOpen={isAddExerciseDialogOpen}
                        onOpenChange={() => setIsAddExerciseDialogOpen(prev => !prev)}
                        exercise={selectedExercise}
                        refetchExercises={refetch}

                    /></div>)
                    }
                </div>
            </div>
        </div>

        </>
    );
};
export default DashboardPage;
