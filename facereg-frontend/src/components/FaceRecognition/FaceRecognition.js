import './FaceRecognition.css'
const FaceRecognition = ({imageUrl, box}) =>
{
    const boundingBoxes = Array.isArray(box) ? box : [];
    return(
        <div className="center ma">
            <div className="absolute mt2">
            <img id = 'inputimage' alt =''src = {imageUrl} width  = "500px" height='auto'/> 
            
            {boundingBoxes.map((singleBox, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{
              top: singleBox.topRow,
              right: singleBox.rightCol,
              left: singleBox.leftCol,
              bottom: singleBox.bottomRow
            }}
          ></div>
        ))}

           
            </div>
            
        </div>
    )
}
export default FaceRecognition