import { useState, useRef } from 'react'
import Header from './Header'
import './App.css'
import Canvas from './Canvas'
import Tools from './Tools'
import FileOptions from './FileOptions'

function App() {
  const [tool, setTool] = useState("pencil")
  const [currentColor, setCurrentColor] = useState("#000000")
  const [uploadedImage, setUploadedImage] = useState([])

  function changeColor(color){
    setCurrentColor(color)
  }

  function displayUploadedImage(pixels){
    setUploadedImage(pixels)
  }

  function changeTool(toolName){
    setTool(toolName)
  }

  class Picture{
    constructor(width, height, pixels){
      this.width = width
      this.height = height
      this. pixels = pixels
    }

    pixel(x,y){
      return this.pixels[x+y*this.width]
    }

    draw(pixels){
      let copy = this.pixels.slice()
      for(let {x,y,color} of pixels){
        copy[x+y * this.width] = color;
      }
      return new Picture(this.width, this.height, copy);
    }
  }
  const scale = 10
  const [currentTool, setCurrentTool] = useState("pencil")

  
  return (
    <>
      <Header></Header>
      <main>
        <div className='canvasContainer'>
          <Tools changeTool={changeTool} changeColor={changeColor} currentColor={currentColor}></Tools>
          <Canvas toolMethod={tool} currentColor={currentColor} changeColor={changeColor} uploadedImage={uploadedImage} displayUploadedImage={displayUploadedImage}></Canvas>
          <FileOptions displayUploadedImage={displayUploadedImage}></FileOptions>
        </div>
        
      </main>
    </>
  )
}

export default App
