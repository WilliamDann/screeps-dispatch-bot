export function creepsOnTask(room: Room, task: string)
{
    let num = 0;
    let creeps = room.find(FIND_MY_CREEPS);
    for (let creep of creeps)
    {
        if (!creep.memory["commands"]) continue;
        if (!creep.memory["commands"][0]) continue;

        if (creep.memory["commands"][0].action == task) num++;
    }

    return num;
}

export function findFillableContainers(room: Room): StructureContainer[]
{
    let containers = room.find(
        FIND_STRUCTURES,
        { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER && s.store.energy != s.store.getCapacity(RESOURCE_ENERGY) }
    }) as StructureContainer[];

    return containers;
}

export function findFilledContainers(room: Room): StructureContainer[]
{
    let containers = room.find(
        FIND_STRUCTURES,
        { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER && s.store.energy != 0 }
    }) as StructureContainer[];

    return containers;
}

export function findConstructionContainer(room: Room)
{
    let sites = room.find(
        FIND_CONSTRUCTION_SITES,
        { filter: (s) => { return s.structureType == STRUCTURE_CONTAINER } }
    );

    return sites[0];
}