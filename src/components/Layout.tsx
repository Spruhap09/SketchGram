import Navigation from "@/components/Navigation"
export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <main className="primary">
            <div className="m-0 p-0 w-full h-1/12 flex flex-col items-end">
                <Navigation/>
            </div>
            <div className="m-0 p-5 w-full h-11/12 flex flex-col justify-center items-center">
                    {children}
            </div>
        </main>
    )
}