
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { useSwipeable } from 'react-swipeable';



const GameBoard = observer((store) => {

      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-600">
          <h1 className="text-6xl font-bold uppercase text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-400">
           
            <div className="flex">
               
            </div>
          </h1>
        
        
         
          {store.wordsGrid2.map((row, rowIndex) => {
            const swipeHandlers = useSwipeable({
              onSwipedLeft: () => handleSwipe(rowIndex, 'LEFT'),
              onSwipedRight: () => handleSwipe(rowIndex, 'RIGHT'),
              onSwipedUp: () => handleSwipe(rowIndex, 'UP'),
              onSwipedDown: () => handleSwipe(rowIndex, 'DOWN'),
           
            });
            const rowMovement = ((store.startingIndexes[rowIndex] -4));
           
            const movement = `translateX(${rowMovement*32}px)`;
            let started = [false, false, false, false, false];
            
            return (
             
              <div key={`wordsGrid-${rowIndex}-${row}`} className="bg-green" {...swipeHandlers}>
                <div className="grid guessed-row" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))", transform: movement, transition: 'transform .3s ease-in-out' }}>
                  {row.map((letter, colIndex) => {
                    let textCol = store.lightningIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex) 
                      ? "white-circle" 
                      : "text-white";
                    const dhb = (letter === "" || !store.lightningEnabled ) ? "" : "lens-inverse";
                    const dcs = (letter === "" || !store.lightningEnabled) ? "15px" : "50px";
                    const borderColor = letter === "" ? "" : "border-2";
                    const animationDelay = `${rowIndex * 0.2}s`;
                    let animationClass = "a";
                  
                    if (store.showColors || store.cheatToggled) {
                      if (store.red2IDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex +rowMovement )) {
                        animationClass = "guess-anim-red";
                      }
                      if (store.orangeIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex +rowMovement)) {
                        animationClass = "guess-anim-orange";
                      }
                      if (store.yellowIDX.some(([yRow, yCol]) => yRow === rowIndex && yCol === colIndex+rowMovement) ) {
                        animationClass = "guess-anim-yellow";
                      }
                    }
                    
                    const backgroundColor = letter === ""
                      ? "bg-transparent"
                      : rowIndex == store.selected
                      ? "bg-blue-400"
                      : "bg-transparent";
    
                    if (letter !== "") {
                      if (started[colIndex]) {
                        started[colIndex] = false;
                      } else {
                        started[colIndex] = true;
                      }
                    }
    
                    return (
                      <div
                      key={`wordsGrid-${rowIndex}-${colIndex}`}
                      id = {`wordsGrid-${rowIndex}-${colIndex}`}
                      data-hover-behavior={dhb}
                      data-circle-size={dcs}
                      className={`h-8 w-8 ${borderColor} ${animationClass} ${backgroundColor} ${textCol} font-bold uppercase flex items-center justify-center`}
                      onMouseEnter={()=>handleMouseOver()}
                      onMouseLeave={handleMouseOut}
                      onClick={action((event) => {
                        store.tryAddLightning([rowIndex, colIndex]);
                        console.log(`Click occurred at pixel coordinates (${event.clientX}, ${event.clientY})`);
                      })}
                      style={{ animationDelay }}
                    >
                      <div className="bg-white rounded-full h-6 w-6 flex items-center justify-center">
                        {letter}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
          
            );
          })}

</div>
    
);
});

export default GameBoard;