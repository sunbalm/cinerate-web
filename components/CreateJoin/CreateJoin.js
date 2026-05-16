import { useRouter } from "next/navigation";

export default function CreateJoin() {
    const router = useRouter();

    return (
        <div className='section'>
            
            <div className='card'>
                <h2>Enter the Fray</h2>
                <div className='grid'>
                    <button onClick={() => router.push("/create-game")}>
                        Create Game
                    </button>
                    <button onClick={() => router.push("/join-game")}>
                        Join Private Game
                    </button>
                </div>
            </div>

        </div>
    )
}