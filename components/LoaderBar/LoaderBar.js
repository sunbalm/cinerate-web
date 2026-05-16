export default function LoaderBar({ time }) {

    return (

        <div className="loader-container">
            <div
                className="loader-bar"
                style={{
                    "--duration": `${time}s`
                }}
            />

        </div>

    );

}