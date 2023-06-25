/* prettier-ignore */ import * as child			from "child_process";
/* prettier-ignore */ import * as readline		from "readline";
/* prettier-ignore */ import * as tslog			from "tslog";
/* prettier-ignore */ import axios				from "axios";
/* prettier-ignore */ import cron				from "node-cron";
/* prettier-ignore */ import fs					from "fs/promises";
/* prettier-ignore */ import { existsSync }		from "fs";
/* prettier-ignore */ import { sig_end_kit }	from "./handler/sig_handler";
/* prettier-ignore */ import { sleep }			from "./module/sleep";
/* prettier-ignore */ import { mini_shell }		from "./module/mini_shell";
import { get_mem } from "./module/get_mem";

const console = new tslog.Logger();

async function update() {
	let url = "https://api.purpurmc.org/v2/purpur/";
	let res = await axios.get(url);
	let version = (res.data["versions"] as string[]).sort().reverse()[0];
	url = `${url}${version}/`;
	res = await axios.get(url);
	let build = res.data["builds"]["latest"];
	url = `${url}${build}/download`;

	// prettier-ignore
	child.execSync("mkdir -p ./mount/minecraft");
	child.execSync("touch ./version.txt", { cwd: "mount" });
	if (url != (await fs.readFile("./mount/version.txt", "utf-8"))) {
		await fs.writeFile("./mount/version.txt", url);
		child.execSync("rm -rf minecraft.jar", { cwd: "./mount/minecraft" });
		// prettier-ignore
		child.execSync(`curl -sLo minecraft.jar ${url}`, { cwd: "./mount/minecraft" });
		if (existsSync("./mount/minecraft")) {
			console.info("Updating");
			child.execSync("rm -rf ./cache", { cwd: "./mount/minecraft" });
			child.execSync("rm -rf ./logs", { cwd: "./mount/minecraft" });
			child.execSync("rm -rf ./versions", { cwd: "./mount/minecraft" });
			child.execSync("rm -rf ./libraries", { cwd: "./mount/minecraft" });
		}
		// prettier-ignore
		child.execSync("echo 'eureka=true' > eula.txt", { cwd: "./mount/minecraft" });
	}
}

async function exec() {
	process.stdin.setEncoding("utf8");

	const reader = readline.createInterface({ input: process.stdin });
	let mem = await get_mem();
	if (Number.isNaN(mem)) {
		console.error("Failed to detect memory size.");
		process.exit(1);
	}
	if (mem <= 1024 + 400) {
		console.error("Too few memory size.");
		process.exit(1);
	}
	if (mem >= 8192 + 400) {
		console.warn("Too many memory size. will be resized to 8192M.")
		mem = 8192 + 400;
	}
	// prettier-ignore
	const proc = child.spawn(`java -Xmx ${(mem - 400).toString().split(".")[0]}M -Xms ${(mem - 400).toString().split(".")[0]}M minecraft.jar nogui`, { cwd: "./mount/minecraft" });

	reader.on("line", (line) => {
		proc.stdin.write(`${line}\n`);
	});

	proc.stdout.setEncoding("utf-8");
	proc.stdout.on("data", async (data) => {
		let lines: string[];
		let i: number = 0;

		lines = data.split("\n");
		lines = lines.filter((line: string) => line !== "");
		while (i < lines.length) console.info(lines[i++]);
		if (data == "Quit correctly\n") process.exit(0);
	});

	sig_end_kit(async (i = 0, exited = false) => {
		proc.addListener("close", () => (exited = true));
		proc.stdin.write("stop\n");
		while (exited == false && ++i <= 40) await sleep(500);
	});

	mini_shell(proc);
}

async function backup() {
	cron.schedule("0 0 0,6,12,18 * * *", async () => {
		console.info("BACKUP");
		child.execSync(`mkdir -p ./mount/backup`);
		let files = await fs.readdir("./mount/backup");
		files.forEach((file) => {
			if (!file.endsWith(".tar.gz"))
				child.execSync(`rm -rf ${file}`, { cwd: "./mount/backup" });
		});
		files = await fs.readdir("./mount/backup");
		if (files.length >= 5) {
			files = files.sort().reverse();
			let i = files.length - 1;
			while (i >= 4)
				child.execSync(`rm -rf ${files[i--]}`, { cwd: "./mount/backup" });
		}
		child.execSync(
			`tar zcfp ../backup/${Date.now()}.tar.gz allowlist.json behavior_packs permissions.json resource_packs server.properties`,
			{ cwd: "./mount/minecraft" }
		);
	});
}

async function main() {
	await update();
	exec();
	backup();
}

/* prettier-ignore */ (_=>_())(main);
