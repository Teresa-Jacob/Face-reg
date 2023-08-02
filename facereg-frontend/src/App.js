import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ParticlesBg from 'particles-bg'
import './App.css';
import { Component } from 'react'
import SignInForm from './components/SignInForm/SignInForm'
import Register from './components/Register/Register'

const returnClarifaiRequestOptions = (imageUrl) =>
{ 
    const PAT = '5641127f505c43d890e02b61acbda53a';
    const USER_ID = 'violet1234';       
    const APP_ID = 'my-first-application-msp4lg';
    const IMAGE_URL = imageUrl;
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
   
  return requestOptions

}


    

   

   
class App extends Component {
  

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''

      }
    }

  }

  loadUser = (data) => {
    
    this.setState({user :{
      id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
      
    }})
  
  }
  calculateFaceLocation  = (data) => {
    console.log(data)
    const regions = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage')
    const width = Number( image.width )
    const height = Number(image.height)
    const FaceLocation = regions.map(region =>{
      const clarifaiFace = region.region_info.bounding_box;
      const faceLocation = {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
      return faceLocation;
    }) 
    return FaceLocation
  }

  displayFacebox = (box) => {
    console.log(box)
    this.setState({box: box})
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    // const imageUrl = 'https://samples.clarifai.com/metro-north.jpg'
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
    .then(response => response.json())
    .then(data => {
      if(data)
      {
        fetch('http://localhost:5000/images', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
      }
      this.displayFacebox(this.calculateFaceLocation(data))
    })
    .catch(error => console.log('Error:', error));  
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});

  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg className="particles" color='#FFFAF0' num={200} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      { route === 'home' ? 
        <div> 
        <Logo />
        <Rank name= {this.state.user.name} entries = {this.state.user.entries}/>
        <ImageLinkForm onInputChange ={this.onInputChange} 
                       onSubmit= {this.onSubmit}/>
        <FaceRecognition box = {box} imageUrl = {imageUrl} />
          </div>
          : (this.state.route === 'signin' ? <SignInForm loadUser= {this.loadUser} onRouteChange = {this.onRouteChange}/>: <Register loadUser= {this.loadUser}onRouteChange = {this.onRouteChange} /> )  
          }
        

        
      </div>
    );
  }
  
}

export default App;
