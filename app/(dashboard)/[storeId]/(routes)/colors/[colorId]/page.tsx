import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

const ColorPage =async ({params}:{params:{colorId:string}}) => {
    //fetch existing colors using id
    const color=await prismadb.color.findUnique({
        where:{
            id:params.colorId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 p-8 space-y-4">
                <ColorForm initialData={color}/>
            </div>
        </div>
     );
}
 
export default ColorPage;