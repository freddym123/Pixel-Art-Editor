import { useRef } from "react"
export default function Tools({changeTool, changeColor, currentColor}){
    const colorVal = useRef("#000000")
    function selectTool(event){
        const tools = document.querySelectorAll(".tool")
        tools.forEach((tool)=>{
            tool.classList.remove("active")
        })

        event.currentTarget.classList.add("active")
        changeTool(event.currentTarget.id)
    }

    return <div className="tools">
        <div className="toolsContainer" >
            <button className="active tool" onClick={selectTool} id="pencil"><i className="fa-solid fa-pencil"></i></button>
            <button className="tool" onClick={selectTool} id="fill"><i className="fa-solid fa-fill-drip"></i></button>
            <button className="tool" onClick={selectTool} id="erase"><i className="fa-solid fa-eraser"></i></button>
            <button className="tool" onClick={selectTool} id="rectangle">&#9645;</button>
            <button className="tool" onClick={selectTool} id="pick"><i className="fa-solid fa-eye-dropper"></i></button>
            <input type="color" onChange={event=>{console.log(event.target.value)
            changeColor(event.target.value)}} value={currentColor}></input>
        </div>
        
    </div>
}