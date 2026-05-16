import LoaderBar from "@/components/LoaderBar";

export default function ConnectionMsg(){
    return (
        <>
            <div className='section'>
                <p>Server is waking up.</p>
            </div>
            <LoaderBar />
        </>
    )
}