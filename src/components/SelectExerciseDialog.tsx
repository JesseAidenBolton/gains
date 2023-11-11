import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
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
   // getExercises: (bodyPart: string) => Exercise[];
}

const SelectExerciseDialog: React.FC<SelectExerciseDialogProps> = ({ isOpen, onOpenChange, bodyPart, onExerciseSelected}) => {

    const exercisesForBodyPart = exerciseList.find(group => group.muscle === bodyPart)?.exercises || [];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Exercise</DialogTitle>
                </DialogHeader>
                {exercisesForBodyPart.map((exercise) => (
                    <Button key={exercise.id} onClick={() => onExerciseSelected(exercise)}>
                        {exercise.exercise}
                    </Button>
                ))}
            </DialogContent>
        </Dialog>
    );
};
export default SelectExerciseDialog;
