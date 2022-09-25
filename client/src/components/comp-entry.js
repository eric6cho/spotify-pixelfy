export default function Entry(props) {
 
  let component = 
    <div className='entry'>
      <div className='image'>
        <img src={props.image} alt='entry'/>
      </div>

      <div className='info'>
        <div className='text'>
          <h2>{props.rank}. {props.name}</h2>
          <p>[ {props.genres} ]</p>
        </div>

        <div className='palette'>
          {props.palette.map((color,i)=><div key={i} className='palette-color' style={color}></div>)}
        </div>
        
      </div>


      
    </div>;

  return component;
}