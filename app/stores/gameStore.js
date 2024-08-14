
import { act } from 'react';
import { makeAutoObservable, action, toJS, set } from "mobx";
import { match } from 'assert';
import next from 'next';
import  getGameBoard  from '../functions/neo4j';

class GameStore{
    constructor(){
        makeAutoObservable(this);
        this.gameBoard = {};
        this.bigConnection = "";
        this.bigConnectionMap = {};
        this.otherConnectionsMap = {};
        this.players = [];
    }

    setGameBoard = (gameBoard) => {
        this.gameBoard = gameBoard;
    }

    setBigConnection = (bigConnection) => {
        this.bigConnection = bigConnection;
    }

    setBigConnectionMap = (bigConnectionMap) => {
        this.bigConnectionMap = bigConnectionMap;
    }

    setOtherConnectionsMap = (otherConnectionsMap) => {
        this.otherConnectionsMap = otherConnectionsMap;
    }

    setPlayers = (players) => {
        this.players = players;
    }
    async init(){
      this.gameBoard = await getGameBoard();
    }
}
export default GameStore;