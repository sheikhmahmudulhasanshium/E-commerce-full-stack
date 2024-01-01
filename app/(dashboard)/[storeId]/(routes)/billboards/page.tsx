import { BillboardClient } from "./components/client";

const BillboardsPage = () => {
    return ( 
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
            {/* this is a client component that will load all the billboard*/}
                <BillboardClient/>
            </div>
        </div>
     );
}
 
export default BillboardsPage;