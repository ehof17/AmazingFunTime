import neo4j, { session } from 'neo4j-driver'
const swagQuery = `
MATCH (p:Player)-[:MEMBER_OF]->(c:Connection)
WITH c, collect(p) as players, count(p) as rels
WHERE rels = 4

UNWIND players as player
MATCH (player)-[:MEMBER_OF]->(c2:Connection)
WHERE c2 <> c
WITH c, players, collect(DISTINCT c2) as additional_connections, count(DISTINCT c2) as connected_count

WITH c, players, additional_connections, connected_count
WHERE size([p in players WHERE size([(p)-[:MEMBER_OF]->(c3:Connection) WHERE c3 <> c | c3]) > 0]) = size(players)

RETURN c as PrimaryConnection, players, connected_count as AdditionalConnections
`;
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
async function getOtherPlayers(session, playerNotToGet, connection){
  const otherConnections = await session.run(
    `MATCH (p:Player )-[:MEMBER_OF]->(c:Connection {name: $name})
    WHERE p.name <> $playerNotToGet
    RETURN p`, 
    { name: connection, playerNotToGet: playerNotToGet });
    console.log(otherConnections)

};
async function checkTwoPlayersConnected(session, player1, player2) {
  const res = await session.run(
    `MATCH (p1:Player {name: $player1})-[:MEMBER_OF]->(c:Connection)<-[:MEMBER_OF]-(p2:Player {name: $player2})
    RETURN c`, 
    { player1, player2 });
    return res.records.length > 0;
}
export default async function getGameBoard() {
    // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
    const URI = 'bolt://localhost:7687'
    const USER = 'neo4j'
    const PASSWORD = 'poop2323'
    let driver
  
    try {
      console.log("We Are Tryin")
      driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD), {
        connectionTimeout: 120000 // Increase connection timeout to 120 seconds
      })
      const serverInfo = await driver.getServerInfo()
      console.log('Connection established')
      console.log(serverInfo)

      const session = driver.session({
        defaultAccessMode: neo4j.session.WRITE,

        database: 'neo4j'
      })
      const gameBoard = {
        bigConnection: 'Won Olympic Gold',
        players: []
    };
      const res = await session.run(swagQuery)
      for (const element of res.records) {
        if(element.get('PrimaryConnection').properties.name == 'Won Olympic Gold') {
       // console.log(`Big Connection: ${element.get('PrimaryConnection').properties.name}`);
        let used_els= [];
        const players = element.get('players');
        for (const player of players) {
            const playerObj = {
              name: player.properties.name,
              Connections: [element.get('PrimaryConnection').properties.name]
          };
            //console.log(player.properties.name);
            const otherConnections = await session.run(
                `MATCH (p:Player {name: $name})-[:MEMBER_OF]->(c:Connection) RETURN c`, 
                { name: player.properties.name }
            );
            const shuffledConnections = shuffleArray(otherConnections.records);

            for (const record of shuffledConnections) {
                const connectionName = record.get('c').properties.name;
                if (connectionName !== element.get('PrimaryConnection').properties.name && !used_els.includes(connectionName)) {
                    used_els.push(connectionName);
                  //  console.log(`\t${connectionName}`);
                    const otherConnections2 = await session.run(
                      `MATCH (p:Player )-[:MEMBER_OF]->(c:Connection {name: $name})
                      WHERE p.name <> $playerNotToGet
                      RETURN p`, 
                      { name: connectionName, playerNotToGet: player.properties.name });
                      playerObj.Connections.push(connectionName);
                      for (const record of otherConnections2.records) {
                        gameBoard.players.push({
                          name: record.get('p').properties.name,
                          Connections: [connectionName]
                        })
                      //  console.log(`\t\t${record.get('p').properties.name}`);
                      }
                     
                  
                    break; // Exit the loop once a valid connection is found
                }
            }
            gameBoard.players.push(playerObj);
        }
     
    }
  }
    //console.log(gameBoard)
    return gameBoard;







    } catch(err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    } finally {
      if (driver) {
        await driver.close()
      }
    }
}
