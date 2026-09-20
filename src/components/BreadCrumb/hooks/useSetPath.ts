import { useEffect, useLayoutEffect, useState } from "react"
import type { TPath } from "../types_"

const useSetPath = ()=>{
    const [path, setPath] =  useState<TPath[] | null>(null)
    const location = window.location.pathname
    const [currentPath, setCurrentPath] =  useState<string | null>(null)

    useLayoutEffect(()=>{
        setCurrentPath(location)
    },[setCurrentPath, location])
    
    
    useEffect(()=>{
        if(currentPath){
            const newCurrentPath = currentPath.replace(/\?.*/, "")
            const piece = newCurrentPath.split("/")
            
            const pieceObj = piece.map((item, index)=> {
                return {
                    index,
                    item
                }
            }).filter((item) => item.item !== "")
        
            setPath(pieceObj)
        }
        
    }, [currentPath])

    const accumulateLinks = ()=>{
        if(path){
            const clonePath = JSON.stringify(path)
            const newClone = JSON.parse(clonePath) as TPath[]
    
            for(let i = 0; i< newClone.length;i++){
                if(i !== 0 ){
                    newClone[i].item= newClone[i-1].item+"/"+newClone[i].item
                    continue
                }
                newClone[i].item= "/"+newClone[i].item
            }
            return newClone
        }
    }
    const link = accumulateLinks()
    return {path,link}
}

export default useSetPath
