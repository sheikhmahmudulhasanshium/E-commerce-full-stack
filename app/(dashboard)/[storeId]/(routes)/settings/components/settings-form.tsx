//this form can be created anywhere but it will be used only in settings
"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps{
    initialData: Store
}
const formSchema = z.object({name: z.string().min(2),});
export const SettingsForm : React.FC<SettingsFormProps>=({initialData})=>{
    
    const params=useParams()
    const router=useRouter()
    const [open,setOpen]=useState(false)

    const [loading,setLoading]=useState(false)

    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
      });

    const onSubmit =async (data:SettingsFormValues) => {
        //console.log(data)
        try{
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`,data)
            router.refresh()
            toast.success("Store Updated.")
        }
        catch(error){
            toast.error("Something went wrong.")
        }
        finally{
            setLoading(false)
        }
    }
    return(
    <>    
        <div className="flex items-center justify-between">
            {/**This is reusable component */}
            <Heading title="Settings" description="Manage Store Preferences"/>
            <Button disabled={loading} variant="destructive" size="sm" onClick={()=>setOpen(true)}>
                <Trash className="w-4 h-4"/>
            </Button>
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                        control={form.control} 
                        name="name" 
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">Save Changes</Button>
            </form>
        </Form>
        
    </>
    )
}