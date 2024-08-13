'use client';
import  GameStore  from "./stores/gameStore";
import getGameBoard from "./functions/neo4j";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";



export default function Home() {
  
  const store = useLocalObservable(() => new GameStore());
  
  useEffect(() => {
    async function fetchData() {
      const swag = await getGameBoard();
      console.log(swag);
      store.setGameBoard(swag);
      store.setBigConnection(swag.bigConnection);

      const bigConnection = swag.bigConnection;
      const bigConnectionMap = {};
      const otherConnectionsMap = {};

      // Create mappings for bigConnection and other connections
      store.players.forEach(player => {
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
    }

    fetchData();
  }, [store]);

  return (
    // <div className="grid grid-cols-4 gap-4 justify-center items-center">
    //   <div className="col-span-2 big-connection-column">
    //     <h2 className="text-center">{bigConnection}</h2>
    //     <div className="players-row flex flex-wrap justify-center">
    //       {bigConnectionMap[bigConnection]?.map(player => (
    //         <div key={`${player.name}-2`} className="player m-2">
    //           <h1>{player.name}</h1>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="col-span-2 other-connections-column">
    //     {Object.keys(otherConnectionsMap).map(connection => (
    //       <div key={connection} className="connection-group mb-4">
    //         <h2 className="text-center">{connection}</h2>
    //         <div className="players-row flex flex-wrap justify-center">
    //           {otherConnectionsMap[connection].map(player => (
    //             <div key={`${player.name}-2`} className="player m-2">
    //               <h1>{player.name}</h1>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div>asdasdad</div>
  );
}