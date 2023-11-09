import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

type Props = {

    muscle: string;

};
import { exerciseList } from "@/data/exerciseList";
import {Button} from "@/components/ui/button";



const AddExerciseDialog = (props: Props) => {


    const exercises = exerciseList.filter(e=> e.muscle === props.muscle)

    console.log(exercises)

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    New exercise
                </DialogTitle>
                <DialogDescription>
                    You can add a new exercise by clicking one of the buttons below.
                </DialogDescription>
            </DialogHeader>
            {exerciseList.map((exercise) => {
                return (
                    <Button key={exercise.id}>{exercise.muscle}</Button>
                )
            })}
        </DialogContent>
    );
};
export default AddExerciseDialog;
