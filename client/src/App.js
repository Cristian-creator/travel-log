import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95,
    zoom: 3
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
      setLogEntries(logEntries);
  }

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (e) => {
    const [ longitude, latitude ] = e.lngLat;
    setAddEntryLocation({
      latitude,
      longitude
    })
    // console.log(e);
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/cristian1231/ck892hz6p0c8v1iqfv8jfg6xp"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map((entry) => (
          <React.Fragment key={entry._id}> 
            <Marker latitude={entry.latitude} longitude={entry.longitude}
            //  offsetLeft={-20} 
            //  offsetTop={-10} 
             >
              <div onClick={()=> setShowPopup({
              // ...showPopup,
              [entry._id]: true,
            })}>
                <img 
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`
                }}
                src="https://i.imgur.com/y0G5YTX.png" 
                alt="marker" 
                className="marker"/>
                </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude={entry.latitude} 
                  longitude={entry.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setShowPopup({})} 
                  anchor="top"
                >
                  <div className="popup">
                    <h3>{ entry.title } </h3>
                    <p> { entry.comments } </p>
                    <small> Visited on:  {new Date(entry.visitDate).toLocaleDateString()} </small>
                    { entry.image && <img src={entry.image} alt={entry.title} /> }
                  </div>
                </Popup>
              ) : null
            }
            </React.Fragment>
        ))
      }
      {
        addEntryLocation ? (
          <>
          <Marker latitude={addEntryLocation.latitude} longitude={addEntryLocation.longitude}>
              <div>
                <img 
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`
                }}
                src="https://i.imgur.com/y0G5YTX.png" 
                alt="marker" 
                className="marker"/>
                </div>
            </Marker>
          <Popup
                latitude={addEntryLocation.latitude} 
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setAddEntryLocation(null)} 
                anchor="top"
              >
                <div className="popup">
                  <LogEntryForm onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }} location={addEntryLocation} />
                </div>
            </Popup>

          </>
        ) : null
      }
    </ReactMapGL>
  );
}

export default App;