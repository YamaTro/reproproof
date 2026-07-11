import { spawn } from 'node:child_process';
import { maskSecrets, sanitizedEnvironment } from './security.js';
import type { ExecutionResult } from './types.js';

const ALLOWED = new Set(['node', 'node.exe', 'npm', 'npm.cmd', 'npx', 'npx.cmd', 'pnpm', 'pnpm.cmd', 'python', 'python.exe', 'python3', 'pytest', 'pytest.exe']);

export async function executeAllowed(command: readonly string[], cwd: string, timeoutMs = 60_000): Promise<ExecutionResult> {
  if (command.length === 0 || !command[0] || !ALLOWED.has(command[0].toLowerCase())) throw new Error('Adapter requested a command that is not allowlisted.');
  const started = Date.now();
  return await new Promise((resolve, reject) => {
    const child = spawn(command[0] as string, command.slice(1), {
      cwd,
      shell: false,
      env: sanitizedEnvironment(),
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const limit = 1_000_000;
    child.stdout?.on('data', (chunk: Buffer) => { stdout = (stdout + chunk.toString('utf8')).slice(-limit); });
    child.stderr?.on('data', (chunk: Buffer) => { stderr = (stderr + chunk.toString('utf8')).slice(-limit); });
    child.on('error', reject);
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      resolve({
        command,
        exitCode,
        timedOut,
        durationMs: Date.now() - started,
        stdout: maskSecrets(stdout),
        stderr: maskSecrets(stderr)
      });
    });
  });
}

export async function executeDocker(command: readonly string[], workspace: string, image: string, timeoutMs = 60_000): Promise<ExecutionResult> {
  if (command.length === 0 || !command[0] || !ALLOWED.has(command[0].toLowerCase())) throw new Error('Adapter requested a command that is not allowlisted.');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._/:@-]{0,200}$/.test(image)) throw new Error('Sandbox image reference is invalid.');
  const docker = process.platform === 'win32' ? 'docker.exe' : 'docker';
  const mount = `type=bind,source=${workspace},target=/workspace,readonly`;
  const args = [
    'run', '--rm', '--network=none', '--read-only', '--cap-drop=ALL',
    '--security-opt=no-new-privileges', '--pids-limit=128', '--cpus=1', '--memory=1g',
    '--user=65532:65532', '--workdir=/workspace', '--tmpfs=/tmp:rw,noexec,nosuid,size=512m',
    '--env=HOME=/tmp', '--env=TMPDIR=/tmp', '--env=PYTHONDONTWRITEBYTECODE=1',
    '--mount', mount, image, ...command
  ];
  const started = Date.now();
  return await new Promise((resolve, reject) => {
    const child = spawn(docker, args, {
      cwd: workspace,
      shell: false,
      env: sanitizedEnvironment(),
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const limit = 1_000_000;
    child.stdout?.on('data', (chunk: Buffer) => { stdout = (stdout + chunk.toString('utf8')).slice(-limit); });
    child.stderr?.on('data', (chunk: Buffer) => { stderr = (stderr + chunk.toString('utf8')).slice(-limit); });
    child.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') reject(new Error('Docker is required for safe execution but was not found. Build the sandbox image or use --unsafe-local-execute only for trusted development fixtures.'));
      else reject(error);
    });
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeoutMs);
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      resolve({ command: [docker, ...args], exitCode, timedOut, durationMs: Date.now() - started, stdout: maskSecrets(stdout), stderr: maskSecrets(stderr) });
    });
  });
}
