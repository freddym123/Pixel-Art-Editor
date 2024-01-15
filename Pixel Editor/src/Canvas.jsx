import {useRef, useEffect, useState} from "react"
export default function Canvas({toolMethod, currentColor, changeColor, uploadedImage, displayUploadedImage, setCurrentCoord}){
    const canvasRef = useRef(null)
    const pixels = useRef(null)
    const coordinates = useRef("")
    const overlayCanvas = useRef(null)
    let scale = 20;
    let cursorScale = useRef(20);
    let numberOfScrolls = 0;
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
        return {x: Math.floor( (pos.clientX - rect.left) / cursorScale.current),
        y: Math.floor((pos.clientY - rect.top) / cursorScale.current)}
    }

    function ghostCursor(event){
        const pos = getCursorPosition(event)
        setCurrentCoord({x: pos.x, y: pos.y})
        if(event.buttons != 0){
            return
        }
        const ctx = canvasRef.current.getContext("2d");
        
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
                if(dx >= 0 && dx < 25 && dy >= 0 && dy < 25 && pixels.current[dx][dy] == targetColor){
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
        //if(newPos.x == pos.x && newPos.y == pos.y) return;
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

    function paintAll(){
        for(let i = 0; i < 60; i++){
            for(let j =0; j < 60; j++){
                pixels.current[i][j] = currentColor
            }
        }
    }

    function mouseDown(event){
        if(event.button != 0){return}
        console.log("hello")
        
        let pos = getCursorPosition(event)
        console.log(pos)
        const ctx = canvasRef.current.getContext('2d')

        if(toolMethod === "fill"){
            fill(pos)
            drawPicture(pos)
            return
        }

        if(toolMethod === "fillall"){
            paintAll()
            drawPicture({x:100, y:100})
            return
        }

        if(toolMethod == "pick"){
            colorPicker(pos)
            return
        }

        
        

        ctx.fillStyle = currentColor

        if(toolMethod=="pencil"){
            ctx.fillRect(pos.x*scale, pos.y*scale, scale,scale)
            pixels.current[pos.x][pos.y] = currentColor
        }else if(toolMethod === "erase"){
            ctx.clearRect(pos.x*scale, pos.y*scale, scale, scale)
            pixels.current[pos.x][pos.y] = false
        }   

        drawPicture(pos)
        let drawn = []

        
        let move = moveEvent =>{
            if(moveEvent.buttons == 0){
                if(toolMethod == "rectangle"){
                    console.log(drawn)
                    for(let i = 0; i < drawn.length; i++){
                        pixels.current[drawn[i].x][drawn[i].y] = currentColor
                    }
                }else if(toolMethod === "line"){
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
                }else if(toolMethod === "line"){
                    drawPicture(moveEvent)
                    drawn = drawLine(pos, moveEvent)
                }else if(toolMethod==="mirror"){
                    mirror(moveEvent, pos)
                }
                else{
                    Erase(moveEvent, pos)
                }
                
               /* */
            }
        }
        
        canvasRef.current.addEventListener("mousemove", move)
        
    }

    function zoom(event){
        console.log(event)
        let canvasWidth = canvasRef.current.getBoundingClientRect().width
        const ctx = canvasRef.current.getContext("2d")
        
        if(event.deltaY < 0 && canvasWidth > 100){
            let newWidth = canvasWidth - 10
            canvasRef.current.style.width = `${newWidth}px`;
            canvasRef.current.style.height = `${newWidth}px`
            cursorScale.current -= .4    
        
        }else if(event.deltaY > 0 && canvasWidth < 1000){
            let newWidth = canvasWidth + 10
            canvasRef.current.style.width = `${newWidth}px`;
            canvasRef.current.style.height = `${newWidth}px`
            cursorScale.current += .4
        }
        
        console.log(canvasRef.current.width)


    }
    
    function drawLine(start, moveEvent){

        let end = getCursorPosition(moveEvent)
        let tri ={}
        
        const ctx = canvasRef.current.getContext("2d")
        ctx.fillStyle = currentColor
        function getTriangle(x1,y1,x2,y2,ang){
            if(Math.abs(x1-x2) > Math.abs(y1-y2)) {
                tri.x = Math.sign(Math.cos(ang));
                tri.y = Math.tan(ang)*Math.sign(Math.cos(ang));
                tri.long = Math.abs(x1-x2);
            } else { 
                tri.x = Math.tan((Math.PI/2)-ang)*Math.sign(Math.cos((Math.PI/2)-ang));
                tri.y = Math.sign(Math.cos((Math.PI/2)-ang));
                tri.long = Math.abs(y1-y2);
            }
        }
        function getAngle(x,y) { return Math.atan(y/(x==0?0.01:x))+(x<0?Math.PI:0); }
        let angle = getAngle(end.x-start.x, end.y-start.y)
        getTriangle(start.x, start.y, end.x, end.y, angle)
        const line = []
        for(let i = 0; i < tri.long; i++){
            let thispoint = {x: Math.round(start.x + tri.x*i), y: Math.round(start.y + tri.y*i)}
            line.push(thispoint)
            ctx.fillRect(thispoint.x*scale, thispoint.y*scale, scale,scale)
        }

        ctx.fillRect(Math.round(end.x)*scale, Math.round(end.y)*scale, scale,scale)
        line.push({x: Math.round(end.x), y: Math.round(end.y)})
        return line
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

    function mirror(moveEvent, pos){
        const ctx = canvasRef.current.getContext("2d")
        ctx.fillStyle = currentColor
        if(pos.x === 12){
            pixels.current[pos.x][pos.y] = currentColor
            
            ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale)
        }else if(pos.x <= 11){
            pixels.current[pos.x][pos.y] = currentColor
            ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale)
            pixels.current[24 - pos.x][pos.y] = currentColor
            ctx.fillRect((24 - pos.x) * scale, pos.y * scale, scale, scale)
        }else{
            pixels.current[pos.x][pos.y] = currentColor
            ctx.fillRect(pos.x * scale, pos.y * scale, scale, scale)
            pixels.current[24 - pos.x][pos.y] = currentColor
            ctx.fillRect((24 - pos.x) * scale, pos.y * scale, scale, scale)
        }
        
        let newPos = getCursorPosition(moveEvent);
        if(newPos.x == pos.x && newPos.y == pos.y) return;
        if(newPos.x === 12){
            ctx.fillRect(newPos.x * scale, newPos.y * scale, scale, scale)
            pixels.current[newPos.x][newPos.y] = currentColor
        }else if(newPos.x <= 11){
            pixels.current[newPos.x][newPos.y] = currentColor
            ctx.fillRect(newPos.x * scale, newPos.y * scale, scale, scale)
            pixels.current[24 - newPos.x][newPos.y] = currentColor
            ctx.fillRect((24 - newPos.x) * scale, newPos.y * scale, scale, scale)
        }else{
            pixels.current[newPos.x][newPos.y] = currentColor
            ctx.fillRect(newPos.x * scale, newPos.y * scale, scale, scale)
            pixels.current[24 - newPos.x][newPos.y] = currentColor
            ctx.fillRect((24 - newPos.x) * scale, newPos.y * scale, scale, scale)
        }
        pos = newPos;
        console.log(pos);
    }

    return (
        <div className="canvasWrapper">
        <canvas className="overlayCanvas" onWheel={zoom} ref={overlayCanvas}></canvas>
        <canvas ref={canvasRef} onMouseDown={mouseDown} onMouseMove={ghostCursor} onMouseOut={()=>{
            setCurrentCoord(null)
            drawPicture({x:90, y:90})}} width="500" height="500" className="drawCanvas" onWheel={zoom}></canvas>
        </div>
        
    )
}