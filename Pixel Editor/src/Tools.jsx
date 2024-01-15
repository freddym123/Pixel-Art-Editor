import { useRef, useState } from "react"
export default function Tools({changeTool, changeColor, currentColor}){
    const [secondaryColor, setSecondaryColor] = useState("#ffffff")
    
    function selectTool(event){
        const tools = document.querySelectorAll(".tool")
        tools.forEach((tool)=>{
            tool.classList.remove("active")
        })

        event.currentTarget.classList.add("active")
        changeTool(event.currentTarget.id)
    }

    function swapColor(){
        let temp = secondaryColor
        setSecondaryColor(currentColor)
        changeColor(secondaryColor)
    }

    return <div className="tools">
        <div className="toolsContainer" >
            <button className="active tool" onClick={selectTool} id="pencil"><i className="fa-solid fa-pencil"></i></button>
            <button className="tool" onClick={selectTool} id="line"><i className="fa-solid fa-arrow-trend-up"></i></button>
            <button className="tool" onClick={selectTool} id="mirror"><i className="fa-solid fa-arrows-split-up-and-left"></i></button>
            <button className="tool" onClick={selectTool} id="fill"><i className="fa-solid fa-fill-drip"></i></button>
            <button className="tool" onClick={selectTool} id="fillall"><i className="fa-solid fa-fill"></i></button>
            <button className="tool" onClick={selectTool} id="erase"><i className="fa-solid fa-eraser"></i></button>
            <button className="tool" onClick={selectTool} id="rectangle">&#9645;</button>
            <button className="tool" onClick={selectTool} id="pick"><i className="fa-solid fa-eye-dropper"></i></button>
        </div>

        <div className="colorContainer">
                <input type="color" onChange={event=>{console.log(event.target.value)
                    changeColor(event.target.value)}} value={currentColor} className="firstColor"></input>
                <input type="color" className="secondColor" value={secondaryColor} onChange={(event)=>{setSecondaryColor(event.target.value)}}></input>
                <div className="swap" onClick={swapColor}><i className="fa-solid fa-retweet"></i></div>
        </div>
        
    </div>
}