'use client'

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowBigLeft} from "lucide-react";
import {useClerk, UserButton} from "@clerk/nextjs";
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
import axios from "axios";
import { utcToZonedTime } from 'date-fns-tz';

type Props = {}


export const runtime = "edge";

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



const DashboardPage = (props: Props) => {

    const { user } = useClerk();
    const userId = user?.id; // Access the user's ID
    const queryClient = useQueryClient();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { data: exercises, isLoading, isError, refetch } = useQuery<Exercise[]>({
        queryKey: ['exercises', userId, selectedDate],
        queryFn: async () => {
            if (!userId || !selectedDate) return [];

            if (selectedDate instanceof Date) {
                const zonedStartDate = utcToZonedTime(startOfDay(selectedDate), userTimeZone);
                const zonedEndDate = utcToZonedTime(endOfDay(selectedDate), userTimeZone);

                const formattedStartOfDay = format(zonedStartDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS');
                const formattedEndOfDay = format(zonedEndDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS');

                const response = await axios.get<Exercise[]>(`/api/getExercise`, {
                    params: {
                        userId: userId,
                        startDate: formattedStartOfDay,
                        endDate: formattedEndOfDay
                    }
                });
                return response.data;
            } else {
                // Handle the case when selectedDate is undefined
                return [];
            }
        },
        enabled: !!userId && !!selectedDate
    });


    const formattedDate = selectedDate ? format(selectedDate, 'EEE MMM dd yyyy') : 'No date selected';

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
                    {/* Left-aligned items */}
                    <div className="flex items-center space-x-4">
                        <Link href='/'>
                            <Button className="bg-primary" size="sm">
                                <ArrowBigLeft className="mr-1 w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                        <CalendarComponent selectedDate={selectedDate} onDateChange={(newDate) => setSelectedDate(newDate)} />
                        <h1 className="text-3xl font-bold text-gray-900">{formattedDate}</h1>
                    </div>

                    {/* Right-aligned items */}
                    <div>
                        <UserButton />
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
                                <ExerciseCard exercise={exercise} refetchExercises={refetch} date={selectedDate} />
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
                        selectedDate={selectedDate}

                    /></div>)
                    }
                </div>
            </div>
        </div>

        </>
    );
};
export default DashboardPage;
