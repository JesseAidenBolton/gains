import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import { exerciseList } from "@/data/exerciseList";

interface SelectBodyDialogProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onBodyPartSelected: (muscle: string) => void;
    //exerciseList: Exercise[];
}


const SelectBodyDialog: React.FC<SelectBodyDialogProps> = ({ isOpen, onOpenChange, onBodyPartSelected }) => {

    console.log("SelectBody Render")
    return (
        <div>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger>
                <div className="border-dashed border-2 flex border-amber-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                    <Plus className="w-6 h-6 text-amber-600" strokeWidth={3} />
                    <h2 className="font-semibold text-amber-600 sm:mt-2">
                        Add New Exercise
                    </h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        New exercise
                    </DialogTitle>
                    <DialogDescription>
                        You can add a new exercise by clicking one of the buttons below.
                    </DialogDescription>
                </DialogHeader>
                {exerciseList.map((exercise) => (
                    <Button key={exercise.id} onClick={() => onBodyPartSelected(exercise.muscle)}>
                        {exercise.muscle}
                    </Button>
                ))}
            </DialogContent>
        </Dialog>
        </div>
    );
};
export default SelectBodyDialog;
