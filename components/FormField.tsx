import React from 'react'
import { Input } from './ui/input'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { FormControl, FormItem, FormLabel } from './ui/form'

interface FormFieldProps<T extends FieldValues>{
    control:Control<T>,
    name:Path<T>,
    label:string,
    placeholder?:string,
    type?:"text" | "email" | "password"

}

const FormField = <T extends FieldValues>({control,name,label,placeholder,type = "text"}:FormFieldProps<T>) => {
  return (
    <Controller 
    name={name}
    control={control}
    
    render={({field})=>(
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Input placeholder={placeholder} {...field} type={type} className='input'/>
            </FormControl>
        </FormItem>
    )}
    />
  )
}

export default FormField

 