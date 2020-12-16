// Manager.ts
//   base class for disbatch instructions
import { Bulletin } from "./Bulletin";

export interface Manager
{
    room     : Room;
    bulletin : Bulletin;

    run(free: Creep[]);
}