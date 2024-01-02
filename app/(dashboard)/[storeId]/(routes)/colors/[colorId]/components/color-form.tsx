//this form can be created anywhere but it will be used only in settings
"use client"

import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Color } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
type ColorFormValues = z.infer<typeof formSchema>
const formSchema = z.object({
    name: z.string().min(2),
    value: z.string().min(4).max(9).regex(/^#/, {
      message: 'String must be a valid hex code'
    }),
  });
  
interface ColorFormProps{
    initialData: Color |null
}
export const ColorForm : React.FC<ColorFormProps>=({initialData})=>{
    
    const params=useParams()
    const router=useRouter()
    
    const [open,setOpen]=useState(false)

    const [loading,setLoading]=useState(false)

    const title =initialData ? "Edit Color": "Create Color"
    const description =initialData ? "Edit a Color": "Create a Color"
    const toastMessage =initialData ? "Color updated.": "Color created."
    const action =initialData ? "Save Changes": "Create"


    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {name: ''}
      });

    const onSubmit =async (data:ColorFormValues) => {
        //console.log(data)
        try{
            setLoading(true)
            //if there exists previous data , it needs to be updated
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,data)

            }
            //otherwise enter new data
            else{
                await axios.post(`/api/${params.storeId}/colors`,data)

            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        }
        catch(error){
            toast.error("Something went wrong.")
        }
        finally{
            setLoading(false)
        }
    }
    
    const onDelete= async ()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success("Color Deleted.")
        }
        catch(error){
            toast.error("Make sure you removed all products using this color first.")
        }
        finally{
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
        <AlertModal 
          isOpen={open} 
          onClose={() => setOpen(false)}
          onConfirm={onDelete}
          loading={loading}
        />
         <div className="flex items-center justify-between">
            {/**This is a reusable component */}
            <Heading title={title} description={description} />
            {initialData && (
              <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
              <div className="gap-8 md:grid md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="Color name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-x-4">
                          <Input disabled={loading} placeholder="Color value" {...field} />
                          <div 
                            className="p-4 border rounded-full" 
                            style={{ backgroundColor: field.value }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={loading} className="ml-auto" type="submit">
                {action}
              </Button>
            </form>
          </Form>
        </>
      );
    };