import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exerciseList } from "@/data/exerciseList";

interface SelectBodyDialogProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onBodyPartSelected: (muscle: string) => void;
}

const SelectBodyDialog: React.FC<SelectBodyDialogProps> = ({ isOpen, onOpenChange, onBodyPartSelected }) => {
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogTrigger>
                    <div className="border-dashed border-2 flex border-primary h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                        <Plus className="w-6 h-6 text-primary" strokeWidth={3} />
                        <h2 className="font-semibold text-primary sm:mt-2">
                            Add New Exercise
                        </h2>
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>
                            New exercise
                        </DialogTitle>
                        <DialogDescription>
                            You can add a new exercise by clicking one of the buttons below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[70vh]">
                        {exerciseList.map((exercise) => (
                            <Button key={exercise.id} onClick={() => onBodyPartSelected(exercise.muscle)} className="w-full mb-2">
                                {exercise.muscle}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SelectBodyDialog;
