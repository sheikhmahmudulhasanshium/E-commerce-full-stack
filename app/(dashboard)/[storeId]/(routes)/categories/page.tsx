import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { format } from "date-fns";
import { CategoryColumn } from "./components/columns";

const CategoriesPage =async ({params}:{params:{storeId:string}}) => {
    const categories=await prismadb.category.findMany({
        where:{
            storeId:params.storeId
        },
        //billboard does not exist on categories that is why we populated billboard by include
        include:{
            billboard:true,
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    const formattedCategories:CategoryColumn[]=categories.map((item)=>({
        id:item.id,
        name:item.name,
        billboardLabel:item.billboard.label,
        createdAt:format(item.createdAt,"MMMM do,yyyy")
    }))
    return ( 
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
            {/* this is a client component that will load all the billboard*/}
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
     );
}
 
export default CategoriesPage;