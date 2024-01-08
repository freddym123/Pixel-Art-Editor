import { useRef, useEffect } from "react"
export default function FileOptions({displayUploadedImage}){
    const fileInput = useRef(null)
    const scale = 20;

    function saveArt(){
        const canvas = document.querySelector("canvas")
        console.log(canvas)
        const link = document.createElement("a")
        link.setAttribute("href", canvas.toDataURL())
        link.setAttribute("download", "pixelart.png")
        console.log(link)
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    function displayImage(event){
        console.log(event)
        console.log(event.target.files)
        let img = new Image;
        img.onload = ()=>{pictureFromImage(img)}
        console.log(event.target.files[0])
        img.src = URL.createObjectURL(event.target.files[0])   
    }

    function pictureFromImage(image){
        console.log(image)
        let width = 500;
        let height = 500;
        let canvas = document.createElement("canvas")
        canvas.setAttribute("width", "500")
        canvas.setAttribute("height", "500")
        console.log(canvas)

        let cx = canvas.getContext("2d", {willReadFrequently: true});
        console.log(image)
        cx.drawImage(image, 0, 0);
        let pixels = [];
        let pixelsRow = 0;
        let pixelsCol = 0;
    
        function hex(n){
            return n.toString(16).padStart(2, "0");
        }

        for(let row = 0; row < 60; row += 1){
            pixels.push(new Array())
            for(let col = 0; col < 60; col+=1){
                
                let {data} = cx.getImageData(row*scale, col*scale, scale, scale);
                let rgb = "#" + hex(data[0]) + hex(data[1]) + hex(data[2])

                if(rgb == "#000000"){
                    if(data[3] == 255){
                        pixels[row].push("#000000")                
                    }else{
                        pixels[row].push(false)
                    }
                    
                }else{
                    pixels[row].push(rgb)
                }
                console.log(data);
            }
            pixelsRow += 1;
            pixelsCol = 0
        }
        
        displayUploadedImage(pixels)

        console.log(pixels)
        return pixels
        
    }

    return(<div className="fileoptions">
        <button type="button" onClick={saveArt}><i className="fa-regular fa-floppy-disk"></i> Save</button>
        <input type="file" id="fileupload" onChange={displayImage} ref={fileInput}></input>
        <label htmlFor="fileupload"><i className="fa-solid fa-upload"></i> Upload</label>
    </div>)
}