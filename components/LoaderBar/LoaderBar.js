export default function LoaderBar(time){
    return (
        <div className="loader-container">
            <div
                className="loader-bar"
                style={{ "--duration": "75s" }}
            />
        </div>
    )
}