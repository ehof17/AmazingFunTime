
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { useEffect } from 'react';



const GameBoard = observer(({ store }) => {
    if (!store.gameBoard || !Array.isArray(store.gameBoard.players)) {
      return null;
    }
  
    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-4 ">
            {console.log(store.gameBoard)}
          {store.gameBoard.players.map((player, index) => {
            let started = [false, false, false, false, false];
      
            return (
              <div key={`wordsGrid-${player.name}-${index}`} className="bg-green flex items-center justify-center border-2">
                <div
                  className=" font-bold uppercase flex items-center justify-center"
                >
                  {player.name}
                  
                </div>
              </div>
            );
          })}
        </div>
      );
  });
  
  export default GameBoard;