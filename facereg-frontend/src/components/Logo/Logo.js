import Tilt from 'react-parallax-tilt';
import './Logo.css';
import bulb from './bulb.png'


const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt options={{ max: 55 }} style={{ height: '120px', width: '120px' }}>
        <div className='Tilt pa3'>
          <img style = {{paddingTop: '5px'}} alt='logo' src = {bulb}/>
        
        </div>
      </Tilt>
    </div>
  );
};
export default Logo