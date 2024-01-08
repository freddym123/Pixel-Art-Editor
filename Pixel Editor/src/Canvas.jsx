import {useRef, useEffect, useState} from "react"
export default function Canvas({toolMethod, currentColor, changeColor, uploadedImage, displayUploadedImage}){
    const canvasRef = useRef(null)
    const pixels = useRef(null)
    const scale = 20;
    const {firstRender, setFirstRender} = useState(true)
    if(uploadedImage.length > 0){
        pixels.current = uploadedImage
        drawPicture({x:100, y: 100})
    }
    console.log(uploadedImage)
    useEffect(()=>{
        
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.fillStyle = "#000000"
        pixels.current = Array(60)
        for(let i = 0; i < pixels.current.length; i++){
            pixels.current[i] = Array(60)
        }

        console.log(pixels)
    },[])

    function getCursorPosition(pos){
        let rect = canvasRef.current.getBoundingClientRect()
        return {x: Math.floor( (pos.clientX - rect.left) / scale),
        y: Math.floor((pos.clientY - rect.top) / scale)}
    }

    function ghostCursor(event){
        if(event.buttons != 0){
            return
        }
        const ctx = canvasRef.current.getContext("2d");
        const pos = getCursorPosition(event)
        ctx.fillStyle= "rgba(211,211,211,.1)"
        ctx.fillRect(pos.x*scale, pos.y*scale, scale, scale)
        drawPicture(pos)
    }

    function rectangle(start, pos){
        const ctx = canvasRef.current.getContext("2d")
        let xStart = Math.min(start.x, pos.x);
        let yStart = Math.min(start.y, pos.y);
        let xEnd = Math.max(start.x, pos.x);
        let yEnd = Math.max(start.y, pos.y);
        let drawn = [];
        ctx.fillStyle = currentColor
        for(let y = yStart; y <= yEnd; y++){
            for(let x = xStart; x <= xEnd; x++){
                drawn.push({x: x, y: y})
                ctx.fillRect(x*scale,y*scale,scale,scale)
            }
        }
        return drawn
    }

    function fill(pos){
        const copy = {x: pos.x, y: pos.y}
        let targetColor = pixels.current[pos.x][pos.y];
        if(targetColor == currentColor){return}
        const nextPixel = [copy]
        let dir = [{x:1,y: 0}, {x: -1, y: 0}, {x:0,y:-1}, {x:0,y:1}]
        while(nextPixel.length > 0){
            let currentPos = nextPixel.pop()
            pixels.current[currentPos.x][currentPos.y] = currentColor
            for(let i = 0; i < dir.length; i++){
                let dx = currentPos.x + dir[i].x
                let dy = currentPos.y + dir[i].y
                if(dx >= 0 && dx < 60 && dy >= 0 && dy < 60 && pixels.current[dx][dy] == targetColor){
                    nextPixel.push({x: dx, y: dy})
                    pixels.current[dx][dy] = currentColor
                }
                
            }
        }


        
    }

    function colorPicker(pos){
        if(pixels.current[pos.x][pos.y]){
            changeColor(pixels.current[pos.x][pos.y])
        }else{
            changeColor("#000000")
        }
    }


    function pencil(moveEvent, pos){
        const ctx = canvasRef.current.getContext("2d")
        pixels.current[pos.x][pos.y] = currentColor
        ctx.fillStyle = currentColor
        ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale)
        let newPos = getCursorPosition(moveEvent);
        if(newPos.x == pos.x && newPos.y == pos.y) return;
        ctx.fillRect(newPos.x * scale, newPos.y * scale, scale, scale)
        pixels.current[newPos.x][newPos.y] = currentColor
        pos = newPos;
        console.log(pos);
    }

    function Erase(moveEvent, oldPos){
        let pos = oldPos
        const ctx = canvasRef.current.getContext("2d")
        ctx.clearRect(pos.x*scale, pos.y*scale, scale, scale)
        pixels.current[pos.x][pos.y] = false
        let newPos = getCursorPosition(moveEvent);
        if(newPos.x == pos.x && newPos.y == pos.y) return;
        ctx.clearRect(newPos.x*scale, newPos.y*scale, scale, scale)
        pixels.current[newPos.x][newPos.y] = false
        pos = newPos;
        console.log(pos);
        drawPicture(pos)
    }

    function mouseDown(event){
        if(event.button != 0){return}
        
        let pos = getCursorPosition(event)
        const ctx = canvasRef.current.getContext('2d')

        if(toolMethod == "fill"){
            fill(pos)
            drawPicture(pos)
            return
        }

        if(toolMethod == "pick"){
            colorPicker(pos)
            return
        }
        

        ctx.fillStyle = currentColor
        ctx.fillRect(pos.x*scale, pos.y*scale, scale,scale)
        drawPicture(pos)
        let drawn = []

        
        let move = moveEvent =>{
            if(moveEvent.buttons == 0){
                if(toolMethod == "rectangle"){
                    console.log(drawn)
                    for(let i = 0; i < drawn.length; i++){
                        pixels.current[drawn[i].x][drawn[i].y] = currentColor
                    }
                }
                canvasRef.current.removeEventListener("mousemove", move);
                
            }else{
                if(toolMethod=="pencil"){
                    pencil(moveEvent, pos)
                }else if(toolMethod == "rectangle"){
                    drawPicture(moveEvent)
                    const newPos = getCursorPosition(moveEvent)
                    drawn = rectangle(pos,newPos)
                }
                else{
                    Erase(moveEvent, pos)
                }
                
               /* */
            }
        }
        
        canvasRef.current.addEventListener("mousemove", move)
        
    }

    

    

    function drawPicture(cursorPos){
        const ctx = canvasRef.current.getContext("2d")
        for(let x = 0; x < 60; x++){
            for(let y = 0; y < 60; y++){
                if(x == cursorPos.x && y == cursorPos.y){
                    ctx.fillStyle= "rgba(211,211,211,.1)"
                    ctx.fillRect(x*scale,y*scale,scale,scale)
                }
                else if(pixels.current[x][y]){
                    ctx.fillStyle = pixels.current[x][y]
                    ctx.fillRect(x*scale,y*scale,scale,scale)
                }else{
                    ctx.clearRect(x*scale, y*scale, scale, scale)
                }
            }
        }
    }

    return <canvas ref={canvasRef} onMouseDown={mouseDown} onMouseMove={ghostCursor} onMouseOut={()=>{drawPicture({x:90, y:90})}} width="500" height="500"></canvas>
}