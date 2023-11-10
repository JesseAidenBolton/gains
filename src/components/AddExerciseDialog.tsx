import {useCallback, useEffect, useMemo, useState} from "react";




import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Minus, Plus} from "lucide-react";


interface AddExerciseDialogProps {
    isOpen: boolean;
    onOpenChange: () => void;
    exercise: string;
    //onExerciseSelected: (exercise: Exercise) => void;
    // getExercises: (bodyPart: string) => Exercise[];
}


const AddExerciseDialog: React.FC<AddExerciseDialogProps> = ({ isOpen, onOpenChange, exercise}) => {

    const [sets, setSets] = useState<number>(1);

    const increase = useCallback(() => {
        setSets((prevSets) => (prevSets < 10 ? prevSets + 1 : prevSets));
    }, []);

    const decrease = useCallback(() => {
        setSets((prevSets) => (prevSets > 1 ? prevSets - 1 : prevSets));
    }, []);



    //console.log("AddExercise Render")

    // Create a list of input elements for sets
    const setInputs = Array.from({ length: sets }, (_, index) => (
        <div key={index} className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor={`set-input-${index}`}>{`Set ${index + 1}`}</Label>
            <Input
                id={`set-input-${index}`}
                defaultValue="10kg"
                className="col-span-2 h-8"
            />
        </div>
    ));

    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger>
            </PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-4 p-4">
                    <h4 className="font-medium leading-none">Sets for {exercise}</h4>
                    <div className="flex justify-between items-center">
                        <Button onClick={decrease} disabled={sets <= 1} className="bg-amber-500 w-10 h-10 m-2">
                            <Minus className="w-4 h-4" strokeWidth={3} />
                        </Button>
                        <Label>{sets}</Label>
                        <Button onClick={increase} disabled={sets >= 10} className="bg-amber-500 w-10 h-10 m-2">
                            <Plus className="w-4 h-4" strokeWidth={3} />
                        </Button>
                    </div>
                    {setInputs}
                </div>
            </PopoverContent>
        </Popover>
    );
};
export default AddExerciseDialog;
