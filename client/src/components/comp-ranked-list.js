import Entry from './comp-entry';

export default function RankedList(props) {
 
  let component = 
    <div className='ranked-list'>
      {
        Object.keys(props.data).map((rank,i) =>
            <Entry 
            key={i}
            rank={rank} 
            name={props.data[rank]['name']} 
            genres={props.data[rank]['genre']}
            image={props.data[rank]['url']} 
            palette={props.data[rank]['paletteStyles']}
            gradient={props.data[rank]['gradientStyle']}
            />
        )
      }
    </div>;

  return component;
}