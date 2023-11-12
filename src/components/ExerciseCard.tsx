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
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
    const exercisesArray = exercise.exercises as { name: string; sets: Set[] }[]; // Type assertion

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const openEditDialog = () => {
        setIsEditDialogOpen(true)
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 grid grid-cols-12 gap-4">
            {/* Exercise Name */}
            <div className="col-span-8">
                <h2 className="text-xl font-semibold mb-2">{exercise.name}</h2>
            </div>

            {/* Pencil Button */}
            <div className="col-span-4 flex items-center justify-end">
                <Button variant="ghost" onClick={openEditDialog}>
                    <Pencil />
                </Button>
            </div>

            {/* Sets Section */}
            <div className="col-span-12 mb-2">
                <p className="text-gray-600">Sets:</p>
                <ul>
                    {exercisesArray.map((exercise, index) => (
                        <li key={index}>
                            <strong>{exercise.name}</strong>
                            <ul>
                                {exercise.sets.map((set, setIndex) => (
                                    <li key={setIndex}>
                                        {setIndex + 1}: Weight: {set.weight} kgs, Reps: {set.reps}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {/* AddExerciseDialog for Editing */}
            {isEditDialogOpen && (
                <AddExerciseDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={() => setIsEditDialogOpen(false)}
                    exercise={exercise.name}
                    lastSets={exercisesArray[0].sets.map((set => set))}
                />
            )}
        </div>
    );
};

export default ExerciseCard;