/* prettier-ignore */ import * as child			from "child_process";
/* prettier-ignore */ import fs					from "fs";

export const get_mem = async (): Promise<number> => {
	let size = NaN;
	if (fs.existsSync("/sys/fs/cgroup/memory.max"))
		size =
			Number(child.execSync("cat /sys/fs/cgroup/memory.max").toString()) / 1000000;
	if (fs.existsSync("/sys/fs/cgroup/memory/memory.limit_in_bytes"))
		size =
			Number(
				child.execSync("cat /sys/fs/cgroup/memory/memory.limit_in_bytes").toString()
			) / 1000000;
	return size;
};
