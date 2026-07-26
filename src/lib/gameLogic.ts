import { ref, set, get, onValue, update, child, push } from "firebase/database";
import { rtdb } from "./firebase";

export type RoomState = {
  status: "LOBBY" | "PLAYING" | "SUMMARY" | "BOARD";
  code: string;
  deck: any[];
  settings: {
    deckId: string;
    topics: string[];
  };
  state: {
    currentTurn: 1 | 2;
    timeLeft: number;
    cardIndex: number;
    isPaused: boolean;
    unlimitedPass: boolean;
    doubleTime: boolean;
    showUndo: boolean;
    // Turn temporary stats
    cardsGuessed: number;
    cardsPassed: number;
    opsPenalties: number;
  };
  teamA: {
    connected: boolean;
    name: string;
    score: number;
    pawn: number;
    position: number;
  };
  teamB: {
    connected: boolean;
    name: string;
    score: number;
    pawn: number;
    position: number;
  };
  hostConnected: boolean;
};

// Generate 5-character alphanumeric code
export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

export const createRoom = async (settings: any, deck: any[]) => {
  const code = generateRoomCode();
  const roomRef = ref(rtdb, `rooms/${code}`);
  
  const newRoom: RoomState = {
    status: "LOBBY",
    code,
    deck,
    settings,
    state: {
      currentTurn: 1,
      timeLeft: 60,
      cardIndex: 0,
      isPaused: false,
      unlimitedPass: false,
      doubleTime: false,
      showUndo: false,
      cardsGuessed: 0,
      cardsPassed: 0,
      opsPenalties: 0,
    },
    teamA: {
      connected: false,
      name: "Squadra A",
      score: 0,
      pawn: 1,
      position: 0
    },
    teamB: {
      connected: false,
      name: "Squadra B",
      score: 0,
      pawn: 4,
      position: 0
    },
    hostConnected: true
  };

  await set(roomRef, newRoom);
  return code;
};

export const joinRoom = async (code: string, teamId: 1 | 2, pawnId: number, teamName: string) => {
  const roomRef = ref(rtdb, `rooms/${code.toUpperCase()}`);
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) {
    throw new Error("Stanza non trovata");
  }
  
  const room = snapshot.val() as RoomState;
  const teamKey = teamId === 1 ? 'teamA' : 'teamB';
  
  if (room[teamKey].connected) {
    throw new Error("Squadra già occupata");
  }

  await update(roomRef, {
    [`${teamKey}/connected`]: true,
    [`${teamKey}/pawn`]: pawnId,
    [`${teamKey}/name`]: teamName
  });
};

export const updateRoomState = async (code: string, updates: Partial<RoomState["state"]>) => {
  const stateRef = ref(rtdb, `rooms/${code.toUpperCase()}/state`);
  await update(stateRef, updates);
};

export const updateRoomStatus = async (code: string, status: RoomState["status"]) => {
  const roomRef = ref(rtdb, `rooms/${code.toUpperCase()}`);
  await update(roomRef, { status });
};

export const updateTeamStats = async (code: string, teamId: 1 | 2, updates: any) => {
  const teamKey = teamId === 1 ? 'teamA' : 'teamB';
  const teamRef = ref(rtdb, `rooms/${code.toUpperCase()}/${teamKey}`);
  await update(teamRef, updates);
};

// Hook for components to subscribe to room changes
export const subscribeToRoom = (code: string, callback: (room: RoomState) => void) => {
  const roomRef = ref(rtdb, `rooms/${code.toUpperCase()}`);
  return onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as RoomState);
    }
  });
};
