import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { exerciseList } from "@/data/exerciseList";

interface Exercise {
    id: number;
    exercise: string;
}

interface SelectExerciseDialogProps {
    isOpen: boolean;
    onOpenChange: () => void;
    bodyPart: string;
    onExerciseSelected: (exercise: Exercise) => void;
}

const SelectExerciseDialog: React.FC<SelectExerciseDialogProps> = ({ isOpen, onOpenChange, bodyPart, onExerciseSelected}) => {
    const exercisesForBodyPart = exerciseList.find(group => group.muscle === bodyPart)?.exercises || [];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>Select Exercise</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[70vh]">
                    {exercisesForBodyPart.map((exercise) => (
                        <Button key={exercise.id} onClick={() => onExerciseSelected(exercise)} className="w-full mb-2">
                            {exercise.exercise}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SelectExerciseDialog;

