import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";

//this is not a reusable component. this is why it is not inside ui folder
const Navbar =async () => {
    const {userId}=auth()
    if(!userId){
        redirect("/sign-in")
    }
    const stores=await prismadb.store.findMany({
        where:{
            //userId:userId
            userId,
        }
    })
    return ( 
        <div className="border-b">
            <div className="flex items-center h-16 px-4">
                <StoreSwitcher items={stores}/>
                
                <MainNav className="mx-6"/>
                <div className="flex items-center ml-auto space-x-4">
                    <ThemeToggle/>
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
            
        </div>
     );
}
 
export default Navbar;