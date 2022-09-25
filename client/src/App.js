import React, { useState, useEffect } from "react";
import RankedList from './components/comp-ranked-list';
import UserTag from './components/comp-user-tag';
import * as u from './scripts/utils'; 
import './styles/main.scss';

export default function App() {
  
  const [serverHost,setServerHost] = useState(null);
  const [token,setToken] = useState(null);
  const [userName,setUserName] = useState(null);
  const [userImage,setUserImage] = useState(null);
  const [pixelArtData,setPixelArtData] = useState(null);
  const [rankLength] = useState(5);

  useEffect(() => {
    let token = u.accessToken;
    
    setToken(token);

    u.fetchGet('/api/IM/wake_up');

    u.setAccessToken(token).then(data => {

      u.getServerHost().then(data => setServerHost(data['url']));

      if(token){
  
        u.getArtists().then(data => {
          let artists = data.slice(0,rankLength);
          let tempPixelArtData = {};
  
          artists.forEach((artist,rank)=>{
            u.getEditedImage(artist['images'][0]['url']).then(data=>{
              data['name'] = artist['name'];
              data['genre'] = artist['genres'][0];
              data['rank'] = rank+1;
    
              tempPixelArtData[rank+1] = data;
          
              if(Object.keys(tempPixelArtData).length===rankLength) 
                setPixelArtData(tempPixelArtData);
            });
          });
        });

        u.getProfile().then(data => {
          setUserName(data['display_name']);
          setUserImage(data['images'][0]['url']);
        });
      }
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getComponent = () => {
    
    const loginComponent = 
      <div className='main-section'>
        <div className='main-section-inner'>
          <div className='title-section'>
          <h1>Pixelfy</h1>
          <p>Your top artists on Spotify:</p>
          </div>
          <div className='login-section'>
            <a className='login-button' href={serverHost+'/login'}>
              Log in to Spotify
            </a>
          </div>
        </div>
      </div>;

    const loadingComponent = 
      <div className='loading-section'>
        <div className='loading-text'>
          <p>Your data is loading :)</p>
        </div>
      </div>;

    const rankListComponent = <RankedList data={pixelArtData}/>;

    const homeComponent = 
      <>      
        <UserTag name={userName} image={userImage}/>
        <div className='main-section'>
          <div className='main-section-inner'>
            <div className='title-section'>
            <h1>Pixelfy</h1>
            <p>Your top artists on Spotify:</p>
            </div>
            {pixelArtData?rankListComponent:loadingComponent}
          </div>
        </div> 
      </>;

    return (
      <div className="App">
        {!token ? loginComponent : homeComponent}
      </div>
    );
  };

  return getComponent();
}