
export default function Loader() {
    return (
        <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ease-in-out delay-300 z-50 w-screen h-screen">
            <img src="loading.svg" className="max-w-xs"/>
        </div>
    )
}