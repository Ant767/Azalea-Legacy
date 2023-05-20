// @ts-ignore
import { Player, system } from "@minecraft/server";
import { TABLES } from "./tables";

system.events.scriptEventReceive.subscribe(
  ({ sourceEntity, message, id }) => {
    if (!(sourceEntity instanceof Player)) return;
    const table = message.split(" ")[0] as keyof typeof TABLES;
    if (!Object.keys(TABLES).includes(table))
      return sourceEntity.tell(`§cNo Table with the name ${table} Exists!`);
    const key = message.split(" ")[1];
    const value = message.split(" ")[2];
    switch (id) {
      case "database:set":
        TABLES[table].set(key, value);
        sourceEntity.tell(
          `Set Key: "${key}", to value: "${value}" on table: "${table}"`
        );
        break;
      case "database:get":
        const tableData = TABLES[table].get(key);
        if (tableData) {
          sourceEntity.tell(JSON.stringify(tableData));
        } else {
          sourceEntity.tell(`§cNo data could be found for key ${key}`);
        }
        break;
      case "database:strain":
        let startTime = Date.now();
        system.events.beforeWatchdogTerminate.subscribe((data) => {
          data.cancel = true;
          sourceEntity.tell(
            `§cStrain Failed at: ${~~((Date.now() - startTime) / 1000)} Seconds`
          );
        });
        for (let i = 0; i < 1000; i++) {
          let str = "";
          let randomKey = "";
          for (let i = 0; i < 1000; i++) str += "asdfgh";
          for (let i = 0; i < 100; i++) randomKey += Math.random();
          TABLES[table].set(randomKey, str);
        }
        sourceEntity.tell(
          `§aCompleted strain in: ${~~(
            (Date.now() - startTime) /
            1000
          )} Seconds`
        );
        break;
      default:
        break;
    }
  },
  {
    namespaces: ["database"],
  }
);
