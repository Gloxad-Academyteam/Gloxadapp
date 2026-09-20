import { GoChevronRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import useSetPath from "./hooks/useSetPath";


const BreadCrumb = ()=> {
const navigate = useNavigate()
const {path,link} = useSetPath()


 return (
    <div className="w-[400px] h-[20px]  rounded-md mx-2 my-2 py-4">
   <div className="text-lg w-[auto] h-[100%] text-primary-10 flex justify-center items-center" >
    <div className="text-title-small  hover:text-primary-7 font-bold cursor-pointer" data-testid="path-container"  onClick={()=> navigate("/")}>Home</div> 
    {
        path && path.map((data,index)=>{
            return <div className="flex" data-testid="path-container" key={data.index}> 
                <GoChevronRight className="mx-4 text-primary-5 font-bold" />
              {link &&  <span className="hover:text-primary-7 cursor-pointer text-title-small font-bold" data-testid="link" onClick={()=> navigate(link[index].item)}>{data.item[0].toUpperCase()}{data.item.slice(1)}</span>}
                </div>
        })
    }
   </div>
    </div>
 )   
}

export default BreadCrumb