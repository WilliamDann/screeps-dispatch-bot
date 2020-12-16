// Manager.ts
//   base class for disbatch instructions
import { Bulletin } from "./Bulletin";

export interface Manager
{
    run(room: Room, free: Creep[], bulletin: Bulletin);
}