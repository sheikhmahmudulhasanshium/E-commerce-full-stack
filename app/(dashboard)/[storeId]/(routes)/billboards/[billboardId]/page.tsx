import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";
import { BillboardColumn } from "../components/columns";
import {format} from "date-fns"

const BillboardPage =async ({params}:{params:{billboardId:string}}) => {
    //fetch existing billboards using id
    const billboard=await prismadb.billboard.findUnique({
        where:{
            id:params.billboardId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 p-8 space-y-4">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
     );
}
 
export default BillboardPage;