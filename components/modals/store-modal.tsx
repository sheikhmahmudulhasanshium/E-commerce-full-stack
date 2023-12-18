"use client"
import * as z from "zod"
import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
const formSchema=z.object({
    //atleast 1 character is required
    name:z.string().min(1),
})
export const StoreModal=()=>{
    const storeModal=useStoreModal()
    //decides which elements should be disabled when it is loading
    const [loading,setLoading]=useState(false)
    
    const form=useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:""
        }
    })
    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
       // console.log(values)
       try{
        setLoading(true)
        //throw new Error("x")
        //trying to create a new store
        const response=await axios.post('/api/stores',values)
        //console.log(response.data)
        toast.success("Store created.")
       }
       catch(error){
        //console.log(error)
        toast.error("Something went wrong")
       }
       finally{
        setLoading(false)
       }
    }
    return(
    <Modal title="Create store" description="Add a new store to manage products and categories."
    isOpen={storeModal.isOpen} onClose={storeModal.onClose}
    >
        <div>
            <div className="py-2 pb-4 space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="E-Commerce" {...field}/>
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center justify-end w-full pt-6 space-x-2">
                           {/**If it is loading user cannot confirm/cancel */}
                           <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>Cancel</Button> 
                           {/*type="submit" will trigger onSubmit props*/}
                           <Button disabled={loading} type="submit">Continue</Button> 
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        
    </Modal>)
}