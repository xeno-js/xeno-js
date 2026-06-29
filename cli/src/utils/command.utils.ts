import { spawn } from 'node:child_process';

export const CommandUtils = {
    runCommand: (command: string, args: string[], cwd: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const isWin = process.platform === "win32";
            const cmd = isWin ? `${command}.cmd` : command;

            const child = spawn(cmd, args, {
                cwd,
                stdio: 'inherit',
                shell: true
            });

            child.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Command ${command} failed with code ${code}`));
            });
        });
    }
};