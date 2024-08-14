'use client';
import  GameStore  from "./stores/gameStore";
import GameBoard from "./components/gameboard";
import getGameBoard from "./functions/neo4j";
import { useLocalObservable, Observer } from "mobx-react-lite";
import { useEffect, useState } from "react";



export default function Home() {
  const [loading, setLoading] = useState(true);
  const store = useLocalObservable(() => new GameStore());
  
  useEffect(() => {
  store.init();
  },[]);
 

  useEffect(() => {
    async function fetchData() {
      const swag = await getGameBoard();
      console.log(swag);
      store.setGameBoard(swag);
      console.log(store)
      store.setBigConnection(swag.bigConnection);
      store.setPlayers(swag.players);


      const bigConnection = swag.bigConnection;
      const bigConnectionMap = {};
      const otherConnectionsMap = {};
      console.log(swag.players)
      // Create mappings for bigConnection and other connections
      swag.players.forEach(player => {
        let hasBigConnection = false;
        player.Connections.forEach(connection => {
          if (connection === bigConnection) {
            if (!bigConnectionMap[bigConnection]) {
              bigConnectionMap[bigConnection] = [];
            }
            bigConnectionMap[bigConnection].push(player);
            hasBigConnection = true;
          } else {
            if (!otherConnectionsMap[connection]) {
              otherConnectionsMap[connection] = [];
            }
            otherConnectionsMap[connection].push(player);
          }
        });

        // Ensure players with bigConnection are also in otherConnectionsMap
        if (hasBigConnection) {
          // Add any additional logic here if needed
        }
      });
      store.setBigConnectionMap(bigConnectionMap);
      store.setOtherConnectionsMap(otherConnectionsMap);
      setLoading(false);
    }

    fetchData();
  }, [store]);

  return (
  
      <Observer>
         {() => (
        <div>
          {loading ? (
            <div>Loading...</div> 
          ) : (
            <div className='flex items-center justify-evenly'>
              <GameBoard store={store} />
            </div>
          )}
        </div>
      )}
      </Observer>
  );
}