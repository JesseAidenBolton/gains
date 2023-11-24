// Define TypeScript types for props
import {Pencil, Repeat, History, ChevronDown, ChevronUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import AddExerciseDialog from "@/components/AddExerciseDialog";
import axios from "axios";
import Link from "next/link";

interface Set {
    weight: string;
    reps: string;
}

interface Exercise {
    id: number;
    name: string;
    userId: string;
    date: Date;
    exercises: unknown;
}

// Additional properties needed for ExerciseCard
interface ExerciseCardProps {
    exercise: Exercise;
    refetchExercises: () => void;
    date: Date | undefined;
    globalCollapse: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps & { globalCollapse: boolean }> = ({ exercise, refetchExercises, date, globalCollapse }) => {


    console.log(`THIS IS: ${JSON.stringify(exercise)}`)

    const exercisesArray = exercise.exercises as { name: string; sets: Set[] }[]; // Type assertion

    //console.log(`AND THEN ${JSON.stringify(exercisesArray)}`)

    const [isToggleOn, setIsToggleOn] = useState(false);

    const [previousSets, setPreviousSets] = useState<Set[]>([]);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(globalCollapse);

    const openEditDialog = () => {
        setIsEditDialogOpen(true)
    }

    const togglePreviousSets = async () => {
        setIsToggleOn(!isToggleOn);
        if (!isToggleOn && exercise.id) {
            setIsLoadingPrevious(true);
            try {
                const url = `/api/getPreviousExercise/${exercise.id}`;
                //console.log("Requesting URL:", url);
                const response = await axios.get(`/api/getPreviousExercise/${exercise.id}`);
                //console.log(`data recieved: ${JSON.stringify(response.data[0].sets, null, 2)}`)
                setPreviousSets(response.data[0].sets);
            } catch (error) {
                console.error("Error fetching previous sets:", error);
            } finally {
                setIsLoadingPrevious(false);
            }
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    useEffect(() => {
        setIsCollapsed(globalCollapse);
    }, [globalCollapse]);


    return (
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow mb-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{exercise.name}</h2>
                <div className="flex items-center">
                    <Button variant="ghost" onClick={toggleCollapse} className="text-gray-600 hover:text-gray-800 mr-2">
                        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {isCollapsed ? null : (
                <div className="mt-3 text-gray-600">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={openEditDialog} className="text-primary hover:text-primary-dark">
                            <Pencil className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" onClick={togglePreviousSets} aria-label="Toggle previous sets" disabled={isLoadingPrevious}>
                            <Repeat className="w-5 h-5" />
                        </Button>
                        <Link href={`/history/${encodeURIComponent(exercise.name)}?name=${encodeURIComponent(exercise.name)}`}>
                            <Button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600">
                                <History className="w-4 h-4 mr-1" />
                                View History
                            </Button>
                        </Link>
                    </div>
                    <p className="uppercase font-semibold text-sm text-gray-500">Sets:</p>
                    <ul>
                        {exercisesArray.map((exercises, index) => (
                            <li key={index} className="mt-1">
                                <span className="font-semibold">{exercise.name}</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {(isToggleOn ? previousSets : exercises.sets).map((set, setIndex) => (
                                        <span key={setIndex} className={`rounded-full px-3 py-1 text-sm ${isToggleOn ? 'bg-red-200' : 'bg-gray-200'}`}>
                                        {setIndex + 1}: {set.weight} kgs, {set.reps} reps
                                    </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {isEditDialogOpen && (
                <AddExerciseDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={() => setIsEditDialogOpen(false)}
                    exercise={exercise.name}
                    lastSets={exercisesArray[0].sets.map((set => set))}
                    id={exercise.id}
                    refetchExercises={refetchExercises}
                    selectedDate={date}
                />
            )}
        </div>
    );
};

export default ExerciseCard;