// Define TypeScript types for props
import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import AddExerciseDialog from "@/components/AddExerciseDialog";

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
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, refetchExercises}) => {
    const exercisesArray = exercise.exercises as { name: string; sets: Set[] }[]; // Type assertion

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const openEditDialog = () => {
        setIsEditDialogOpen(true)
    }

    return (

        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow mb-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{exercise.name}</h2>
                <Button variant="ghost" onClick={openEditDialog} className="text-primary hover:text-primary-dark">
                    <Pencil className="w-5 h-5" />
                </Button>
            </div>

            <div className="mt-3 text-gray-600">
                <p className="uppercase font-semibold text-sm text-gray-500">Sets:</p>
                <ul>
                    {exercisesArray.map((exercise, index) => (
                        <li key={index} className="mt-1">
                            <span className="font-semibold">{exercise.name}</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {exercise.sets.map((set, setIndex) => (
                                    <span key={setIndex} className="bg-gray-200 rounded-full px-3 py-1 text-sm">
                                        {setIndex + 1}: {set.weight} kgs, {set.reps} reps
                                    </span>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* AddExerciseDialog for Editing */}
            <div>
            {isEditDialogOpen && (
                <AddExerciseDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={() => setIsEditDialogOpen(false)}
                    exercise={exercise.name}
                    lastSets={exercisesArray[0].sets.map((set => set))}
                    id={exercise.id}
                    refetchExercises={refetchExercises}
                />
            )}
            </div>
        </div>
    );
};

export default ExerciseCard;