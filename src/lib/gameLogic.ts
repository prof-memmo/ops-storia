import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { hubDb } from "./firebase";

export type RoomState = {
  status: "LOBBY" | "PLAYING" | "SUMMARY" | "BOARD" | "LEADERBOARD";
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
    lastSpecialNotice?: string;
  };
  teamA: {
    connected: boolean;
    name: string;
    score: number;
    pawn: number;
    position: number;
    pendingBonus?: {
      unlimitedPass: boolean;
      doubleTime: boolean;
    };
  };
  teamB: {
    connected: boolean;
    name: string;
    score: number;
    pawn: number;
    position: number;
    pendingBonus?: {
      unlimitedPass: boolean;
      doubleTime: boolean;
    };
  };
  hostConnected: boolean;
};

// Generate 5-character alphanumeric code
export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

export const createRoom = async (settings: any, deck: any[]) => {
  const code = generateRoomCode();
  const roomRef = doc(hubDb, "ops_rooms", code);
  
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
      position: 1,
      pendingBonus: {
        unlimitedPass: false,
        doubleTime: false
      }
    },
    teamB: {
      connected: false,
      name: "Squadra B",
      score: 0,
      pawn: 4,
      position: 1,
      pendingBonus: {
        unlimitedPass: false,
        doubleTime: false
      }
    },
    hostConnected: true
  };

  await setDoc(roomRef, newRoom);
  return code;
};

export const joinRoom = async (code: string, teamId: 1 | 2, pawnId: number, teamName: string) => {
  const cleanCode = code.trim().toUpperCase();
  const roomRef = doc(hubDb, "ops_rooms", cleanCode);
  const snapshot = await getDoc(roomRef);
  if (!snapshot.exists()) {
    throw new Error("Stanza non trovata. Verifica il codice inserito.");
  }
  
  const room = snapshot.data() as RoomState;
  const teamKey = teamId === 1 ? 'teamA' : 'teamB';
  
  if (room[teamKey] && room[teamKey].connected) {
    throw new Error("Squadra già occupata da un altro dispositivo.");
  }

  await updateDoc(roomRef, {
    [`${teamKey}.connected`]: true,
    [`${teamKey}.pawn`]: pawnId,
    [`${teamKey}.name`]: teamName
  });
};

export const updateRoomState = async (code: string, updates: Partial<RoomState["state"]>) => {
  const cleanCode = code.trim().toUpperCase();
  const roomRef = doc(hubDb, "ops_rooms", cleanCode);
  const flatUpdates: Record<string, any> = {};
  for (const [key, val] of Object.entries(updates)) {
    flatUpdates[`state.${key}`] = val;
  }
  await updateDoc(roomRef, flatUpdates);
};

export const updateRoomStatus = async (code: string, status: RoomState["status"]) => {
  const cleanCode = code.trim().toUpperCase();
  const roomRef = doc(hubDb, "ops_rooms", cleanCode);
  await updateDoc(roomRef, { status });
};

export const updateTeamStats = async (code: string, teamId: 1 | 2, updates: any) => {
  const cleanCode = code.trim().toUpperCase();
  const teamKey = teamId === 1 ? 'teamA' : 'teamB';
  const roomRef = doc(hubDb, "ops_rooms", cleanCode);
  const flatUpdates: Record<string, any> = {};
  for (const [key, val] of Object.entries(updates)) {
    flatUpdates[`${teamKey}.${key}`] = val;
  }
  await updateDoc(roomRef, flatUpdates);
};

// Hook for components to subscribe to room changes
export const subscribeToRoom = (code: string, callback: (room: RoomState) => void) => {
  const cleanCode = code.trim().toUpperCase();
  const roomRef = doc(hubDb, "ops_rooms", cleanCode);
  return onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as RoomState);
    }
  });
};
