

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
import AddExerciseDialog from "@/components/AddExerciseDialog";
import { exerciseList } from "@/data/exerciseList";
import {useEffect, useState} from "react";

type Props = {
    muscle: string,
};




const SelectBodyDialog = () => {


    const [buttons, setButtons] = useState( exerciseList.map((exercise) => {
            return (
                <Button key={exercise.id} onClick={() => {handleClick(exercise.muscle)}}>{exercise.muscle}</Button>
            )
        }))

    const [muscle, setMuscle] = useState('')


    const getExercises = (muscle: string) => {
        const filter = exerciseList.filter(e => e.muscle === muscle)
        return filter[0].exercises
    }

    const handleClick = (bodyType: string) => {




        const exercises = getExercises(bodyType)

        console.log(exercises)

        setButtons(exercises.map((exercise) => {
            return (
                <Button key={exercise.id} onClick={() => {handleClick(exercise.exercise)}}>{exercise.exercise}</Button>
            )
        }))




    }

    return (
        <div>
        <Dialog>
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
                {buttons}
                {/*{exerciseList.map((exercise) => {
                    return (
                        <Button key={exercise.id} onClick={() => {handleClick(exercise.muscle)}}>{exercise.muscle}</Button>
                    )
                })}*/}
            </DialogContent>
        </Dialog>

        </div>
    );
};
export default SelectBodyDialog;
