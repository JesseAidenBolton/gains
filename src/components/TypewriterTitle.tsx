'use client'
import Typewriter from 'typewriter-effect'

type Props = {};
const TypewriterTitle = (props: Props) => {

    return (
        <Typewriter
            options={{
                loop:true,
            }}
            onInit={(typewriter) => {
                typewriter.typeString("Every Rep Counts!💪")
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString("From Goals to Greatness!🏁")
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString("Achieve Your Peak Performance!🏆")
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString("Your Progress, Visualized!📈")
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString("Transform with Every Track!🌟")
                    .start();
            }}
        />
    );
};
export default TypewriterTitle;
